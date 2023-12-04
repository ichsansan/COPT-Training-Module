from typing import Dict, Union, Optional, List, Tuple
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import MinMaxScaler, StandardScaler, RobustScaler, QuantileTransformer
import numpy as np
from tensorflow.keras.optimizers import Adam, RMSprop, Nadam, Adadelta, SGD, Adamax, Ftrl
from keras.models import Model

from keras.losses import MeanAbsoluteError, MeanSquaredError

from keras.layers import Input, Convolution2D, Dense, concatenate, multiply, Flatten, LSTM, TimeDistributed, Reshape, \
    RepeatVector, Permute, Dropout, Embedding, Reshape, Add, BatchNormalization, LeakyReLU, Dot

from keras.activations import selu

from keras.initializers import RandomNormal

from keras.regularizers import l2, l1

from sklearn.ensemble import IsolationForest

from sklearn.pipeline import Pipeline

from keras.callbacks import EarlyStopping
from .bench_inputs import MINUTE_INPUT_KIND, DAY_INPUT_KIND, SENSOR_INPUT_KIND, PRESENT_INDICES, PRESENT_INPUT, \
    BlankTransformer, MinutesToHour, DayToPeriod, DayToSeasonal
from keras import backend as K

from keras.layers import Activation
from keras.utils.generic_utils import get_custom_objects

import sys
import xgboost as xgb
#from yellowbrick.regressor import CooksDistance
from sklearn.linear_model import Ridge
if ".." not in sys.path:
    sys.path.append("..")

import math


OPTIMIZERS = {
    "nadam": Nadam,
    "adam": Adam,
    "adamax": Adamax,
    "rmsprop": RMSprop,
    "adadelta": Adadelta,
    "ftrl": Ftrl,
    "sgd": SGD
}

MV_INPUT_LIMIT_MAGNITUDE = 4


def createSumAccumulator(t_dim):
    return np.triu(np.ones((t_dim, t_dim)))


def residual_block(y, nb_channels, _strides=(1, 1), _project_shortcut=False):
    """
    CNN residual block architecture used for feeding the current layer to a number of the next layers
    """
    shortcut = y

    # down-sampling is performed with a stride of 2
    y = Convolution2D(nb_channels, kernel_size=(
        3, 3), strides=_strides, padding='same')(y)
    y = BatchNormalization()(y)
    y = LeakyReLU()(y)

    y = Convolution2D(nb_channels, kernel_size=(
        3, 3), strides=(1, 1), padding='same')(y)
    y = BatchNormalization()(y)

    # identity shortcuts used directly when the input and output are of the same dimensions
    if _project_shortcut or _strides != (1, 1):
        # when the dimensions increase projection shortcut is used to match dimensions (done by 1×1 convolutions)
        # when the shortcuts go across feature maps of two sizes, they are performed with a stride of 2
        shortcut = Convolution2D(nb_channels, kernel_size=(
            1, 1), strides=_strides, padding='same')(shortcut)
        shortcut = BatchNormalization()(shortcut)

    y = Add()([shortcut, y])
    y = LeakyReLU()(y)

    return y


def total_sum_loss(y_true, y_pred):
    sum_true = K.sum(y_true, axis=2)
    sum_pred = K.sum(y_pred, axis=2)
    abs_diff = K.abs(sum_true-sum_pred)
    return K.mean(abs_diff)


def mae_cnn_loss(y_true, y_pred):
    # Reduce along variables
    abs_diff = K.sum(K.abs(y_true - y_pred), axis=1)
    return K.mean(abs_diff)  # Reduce along horizon


def mae_cnn_accum_loss(y_true, y_pred):
    sum_accumulator = K.constant(createSumAccumulator(y_true.shape[2]))
    pred_sum = K.dot(K.abs(y_pred), sum_accumulator)
    # Reduce along variables
    abs_diff = K.sum(K.abs(y_true - pred_sum), axis=1)
    return K.mean(abs_diff)  # Reduce along horizon


def neg_mse_cnn_loss(y_true, y_pred):
    # Reduce along variables
    sqr_diff = K.sum(K.square(y_true - y_pred), axis=1)
    return - K.mean(sqr_diff)  # Reduce along horizon


def neg_mae_cnn_loss(y_true, y_pred):
    # Reduce along variables
    abs_diff = K.sum(K.abs(y_true - y_pred), axis=1)
    return - K.mean(abs_diff)  # Reduce along horizon


def mse_cnn_loss(y_true, y_pred):
    # Reduce along variables
    sqr_diff = K.sum(K.square(y_true - y_pred), axis=1)
    return K.mean(sqr_diff)  # Reduce along horizon


def mse_cnn_accum_loss(y_true, y_pred):
    sum_accumulator = K.constant(createSumAccumulator(y_true.shape[2]))
    pred_sum = K.dot(K.abs(y_pred), sum_accumulator)
    # Reduce along variables
    abs_diff = K.sum(K.square(y_true - pred_sum), axis=1)
    return K.mean(abs_diff)  # Reduce along horizon


def mse_std_cnn_loss(y_true, y_pred):
    # Reduce along horizon
    std_true = K.std(y_true, axis=2)
    std_pred = K.std(y_pred, axis=2)

    # Reduce along variables
    std_sqr_diff = K.square(std_true - std_pred)

    # Reduce along variables
    return K.mean(std_sqr_diff)


def mae_std_cnn_loss(y_true, y_pred):
    # Reduce along horizon
    std_true = K.std(y_true, axis=2)
    std_pred = K.std(y_pred, axis=2)

    # Reduce along variables
    std_abs_diff = K.abs(std_true - std_pred)

    # Reduce along variables
    return K.mean(std_abs_diff)


def gelu(x):
    return 0.5 * x * (1 + K.tanh(x * 0.7978845608 * (1 + 0.044715 * x * x)))


def cap_gauss_activation(x):
    """
    Keeps the last layer in the range between [-4 * sigma, +4 * sigma].
    It is meant to be used when the labels are standardized.
    """
    return K.maximum(K.minimum(x, K.constant(4)), K.constant(-4))
    # return K.tanh(x) * K.constant(4)


def cap_efficiency(x):
    # return K.maximum(K.minimum(x, K.constant(100)), K.constant(60))
    return K.tanh(x) * 100


LOSS = {
    "mae": mae_cnn_loss,
    "mse": mse_cnn_loss,
}


class CapExtremeValues(BaseEstimator, TransformerMixin):
    """
    Label transformer putting a cap on values.
    The threshold is around the average based on standard deviation.
    """
    _sigma_magnitude = 3.5

    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        std = np.std(X, axis=0)
        mean = np.mean(X, axis=0)
        # np.clip(X, a_min=mean-self._sigma_magnitude*std, a_max=mean+self._sigma_magnitude*std, out=X)
        return np.clip(X, a_min=mean-self._sigma_magnitude*std, a_max=mean+self._sigma_magnitude*std)

    def inverse_transform(self, X):
        return X


LABEL_TRANSFORMERS = {
    "max_min": MinMaxScaler,
    "standardize": StandardScaler,
    "robust": RobustScaler,
    "quantile": QuantileTransformer,
    "cap_extremes": CapExtremeValues
}


class CNNForecaster(BaseEstimator):
    """
    Convolutional Neural Networks Estimator

    Attributes
    ----------
    **estimator_params : mult
        Data manipulation parameters, Model-specific parameters and hyperparameters
        for controlling the model architecture and NN learning process.

    Methods
    -------
    design_primal_model :
        Returns a preliminary model design.
    design_model :
        Refined model design
    __initialize_model :
        Assigns and initializes the relevant parameters in the model design process.
    __fit :
        Fits the training data and labels to the appropriate model.
    fit_predict :
        Initializes the model, prepares the input, fits the model and produces results with
        appropriate transformations.
    fit :
        Prepares the correct input set and calls fitting function.
    predict :
        Produces results based on already trained model.
    """

    def __init__(self, **estimator_params):
        self.estimator_params = estimator_params

        self.loss = LOSS[self.estimator_params["loss"]]

        alpha = self.estimator_params["exp_smooth_alpha"]
        if alpha > 1 or alpha <= 0:
            raise ValueError(
                "Alpha should be between 0 and 1 for Exp Smothing.")

        preprocessing_steps = []
        if "label_transformers" in self.estimator_params and len(estimator_params["label_transformers"]) > 0:
            for transformer_name in estimator_params["label_transformers"]:
                if transformer_name in LABEL_TRANSFORMERS:
                    preprocessing_steps.append(
                        (transformer_name, LABEL_TRANSFORMERS[transformer_name]()))

        if len(preprocessing_steps) == 0:
            preprocessing_steps.append(
                ("blank_transformer", BlankTransformer()))
        self.transformer = Pipeline(preprocessing_steps)

        if "augment_factor" not in estimator_params:
            self.estimator_params["augment_factor"] = 1
        else:
            self.estimator_params["augment_factor"] = estimator_params["augment_factor"]

        if "top_mv_diffs_ratio" not in estimator_params:
            self.estimator_params["top_mv_diffs_ratio"] = 0
        else:
            self.estimator_params["top_mv_diffs_ratio"] = estimator_params["top_mv_diffs_ratio"]

    def design_primal_model(self,
                            horizon_length,
                            mv_variables_length,
                            cv_variables_length,
                            drop_out_rate,
                            reg_penalty,
                            h_dim):
        """Preliminary model design.

        Args
        ----
        horizon_length : int
            The number of future timesteps we are predicting for.
        mv_variables_length : int
            The number of past timesteps of MV variables we are using as input.
        cv_variables_length: int
            The number of past timesteps of CV variables we are using as input.
        drop_out_rate: float
            Drop out rate used as hyperparameter
        reg_penalty: float
            Regularization penalty used as hyperparameter
        h_dim: int
            Hidden dimensions, a number signifying the depth of the DL model.

        Returns
        -------
        model
            The model object.
        """

        minute_input = Input(shape=(1, 1))
        day_input = Input(shape=(1, 1))
        present_mv_input = Input(shape=(mv_variables_length, 1))
        present_cv_input = Input(shape=(cv_variables_length, 1))

        present_mv_layer = Permute((2, 1))(present_mv_input)
        present_mv_layer = Dense(h_dim, activation='relu')(present_mv_layer)
        present_mv_layer = Dropout(drop_out_rate)(present_mv_layer)

        present_cv_layer = Dense(h_dim, activation='relu')(present_cv_input)
        present_cv_layer = Dropout(drop_out_rate)(present_cv_layer)

        minute_layer = Reshape((1, h_dim))(Embedding(24, h_dim)(minute_input))
        minute_layer = Dropout(drop_out_rate)(minute_layer)

        day_layer = Reshape((1, h_dim))(Embedding(7, h_dim)(day_input))
        day_layer = Dropout(drop_out_rate)(day_layer)

        output = concatenate(
            [present_mv_layer, present_cv_layer, minute_layer, day_layer], axis=1)
        output = Dense(1, activation="relu")(output)
        output = Permute((2, 1))(output)
        output = Dense(1, activation="sigmoid")(output)
        output = Flatten()(output)
        output = RepeatVector(horizon_length)(output)
        output = Permute((2, 1))(output)

        model = Model([minute_input, day_input,
                      present_mv_input, present_cv_input], output)

        return model

    def design_model(self,
                     horizon_length,
                     mv_variables_length,
                     cv_variables_length,
                     mv_history_length,
                     cv_history_length,
                     drop_out_rate,
                     reg_penalty,
                     h_dim):
        """Refined model design

        Args
        ----
        horizon_length : int
            The number of future timesteps we are predicting for.
        mv_variables_length : int
            The number of past timesteps of MV variables we are using as input.
        cv_variables_length: int
            The number of past timesteps of CV variables we are using as input.
        drop_out_rate: float
            Drop out rate used as hyperparameter
        reg_penalty: float
            Regularization penalty used as hyperparameter
        h_dim: int
            Hidden dimensions, a number signifying the depth of the DL model.

        Returns
        -------
        model
            The model object."""

        # Prepare MV input.
        mv_sensor_input = Input(
            shape=(mv_variables_length, mv_history_length, 1))
        mv_sensor_layer = Permute((2, 1, 3))(mv_sensor_input)

        # Prepare CV input.
        cv_sensor_input = Input(
            shape=(cv_variables_length, cv_history_length, 1))
        cv_sensor_layer = Permute((2, 1, 3))(cv_sensor_input)

        # Prepare minute input.
        minute_input = Input(shape=(1, 1))
        minute_layer = Reshape((cv_variables_length, h_dim))(
            Embedding(24, h_dim * cv_variables_length)(minute_input))
        minute_layer = Dropout(drop_out_rate)(minute_layer)

        day_input = Input(shape=(1, 1))
        day_layer = Reshape((cv_variables_length, h_dim))(
            Embedding(7, h_dim * cv_variables_length)(day_input))
        day_layer = Dropout(drop_out_rate)(day_layer)

        # Prepare present MV input.
        present_mv_input = Input(shape=(mv_variables_length, 1))
        present_mv_layer = Permute((2, 1))(present_mv_input)
        present_mv_layer = Dense(h_dim,
                                 activation="relu")(present_mv_layer)
        present_mv_layer = Dropout(drop_out_rate)(present_mv_layer)

        # Prepare present CV input.
        present_cv_input = Input(shape=(cv_variables_length, 1))
        present_cv_layer = Permute((2, 1))(present_cv_input)
        present_cv_layer = Dense(h_dim,
                                 activation="relu")(present_cv_input)
        present_cv_layer = Dropout(drop_out_rate)(present_cv_layer)

        # Extract features from the MV input.
        mv_sensor_layer = Convolution2D(
            filters=h_dim,
            kernel_size=(1, mv_variables_length),
            strides=(1, mv_variables_length),
            activation="relu",
            data_format="channels_last",
            kernel_regularizer=l2(reg_penalty),
            bias_regularizer=l2(reg_penalty))(mv_sensor_layer)
        mv_sensor_layer = Dropout(drop_out_rate)(mv_sensor_layer)

        # second_mv_sensor_layer = Convolution2D(
        #     filters=h_dim,
        #     kernel_size=(3, 1),
        #     strides=(3, 1),
        #     activation="relu",
        #     data_format="channels_last",
        #     kernel_regularizer=l2(reg_penalty),
        #     bias_regularizer=l2(reg_penalty))(mv_sensor_layer)
        # second_mv_sensor_layer = Dropout(drop_out_rate)(second_mv_sensor_layer)

        # mv_sensor_layer = concatenate(
        #     [mv_sensor_layer, second_mv_sensor_layer], axis=1)

        mv_sensor_layer = TimeDistributed(Flatten())(mv_sensor_layer)
        mv_sensor_layer = concatenate(
            [mv_sensor_layer, present_mv_layer, minute_layer, day_layer], axis=1)

        mv_sensor_layer = Dense(h_dim,
                                activation="relu",
                                kernel_regularizer=l2(reg_penalty),
                                bias_regularizer=l2(reg_penalty))(mv_sensor_layer)
        mv_sensor_layer = Dropout(drop_out_rate)(mv_sensor_layer)

        mv_sensor_layer = Dense(h_dim,
                                activation="relu",
                                kernel_regularizer=l2(reg_penalty),
                                bias_regularizer=l2(reg_penalty))(mv_sensor_layer)
        mv_sensor_layer = Dropout(drop_out_rate)(mv_sensor_layer)

        # Extract features from the CV sensor.
        cv_sensor_layer = Convolution2D(
            filters=h_dim,
            kernel_size=(5, cv_variables_length),
            strides=(5, cv_variables_length),
            activation="relu",
            data_format="channels_last",
            kernel_regularizer=l2(reg_penalty),
            bias_regularizer=l2(reg_penalty))(cv_sensor_layer)
        cv_sensor_layer = Dropout(drop_out_rate)(cv_sensor_layer)

        # second_cv_sensor_layer = Convolution2D(
        #     filters=h_dim,
        #     kernel_size=(5, 1),
        #     strides=(5, 1),
        #     activation="relu",
        #     data_format="channels_last",
        #     kernel_regularizer=l2(reg_penalty),
        #     bias_regularizer=l2(reg_penalty))(cv_sensor_layer)
        # second_cv_sensor_layer = Dropout(drop_out_rate)(second_cv_sensor_layer)

        # cv_sensor_layer = concatenate(
        #     [cv_sensor_layer, second_cv_sensor_layer], axis=1)

        cv_sensor_layer = TimeDistributed(Flatten())(cv_sensor_layer)

        cv_sensor_layer = concatenate(
            [present_cv_layer, minute_layer, day_layer], axis=1)

        cv_sensor_layer = Dense(h_dim,
                                activation="relu",
                                kernel_regularizer=l2(reg_penalty),
                                bias_regularizer=l2(reg_penalty))(cv_sensor_layer)
        cv_sensor_layer = Dropout(drop_out_rate)(cv_sensor_layer)

        x = concatenate([mv_sensor_layer, cv_sensor_layer], axis=1)

        x = Permute((2, 1))(x)
        x = Dense(horizon_length,
                  activation="relu")(x)
        x = Dropout(drop_out_rate)(x)
        x = Permute((2, 1))(x)

        x = TimeDistributed(Dense(cv_variables_length,
                                  activation="sigmoid",
                                  kernel_regularizer=l2(reg_penalty),
                                  bias_regularizer=l2(reg_penalty)))(x)

        output = Permute((2, 1))(x)

        model = Model([mv_sensor_input, minute_input, day_input,
                       present_mv_input, present_cv_input], [output, output])

        return model

    def __initialize_model(self, X, y):
        """
        Assigns and initializes the relevant parameters in the model design process.
        """

        cv_history_length = self.estimator_params["cv_history_length"]
        mv_history_length = self.estimator_params["mv_history_length"]
        horizon_length = self.estimator_params["horizon_length"]
        cv_variables = self.estimator_params["variables"]
        mv_variables_length = len(self.estimator_params["mv_variables"]) if "mv_variables" in self.estimator_params \
            else 0
        drop_out_rate = self.estimator_params["drop_out_rate"]
        reg_penalty = self.estimator_params["reg_penalty"]
        h_dim = self.estimator_params["h_dim"]

        is_primal_model = self.estimator_params["primal_model"]

        if is_primal_model:
            self.model = \
                self.design_primal_model(
                    horizon_length=horizon_length,
                    mv_variables_length=mv_variables_length,
                    cv_variables_length=len(cv_variables),
                    drop_out_rate=drop_out_rate,
                    reg_penalty=reg_penalty,
                    h_dim=h_dim)
        else:
            self.model = \
                self.design_model(
                    horizon_length=horizon_length,
                    mv_variables_length=mv_variables_length,
                    cv_variables_length=len(cv_variables),
                    mv_history_length=mv_history_length,
                    cv_history_length=cv_history_length,
                    drop_out_rate=drop_out_rate,
                    reg_penalty=reg_penalty,
                    h_dim=h_dim)

        if(self.estimator_params["verbose"] == 2):
            print(f"{self.model.summary()}")

    def __fit(self, input: List[np.ndarray], labels: np.ndarray):
        callback = EarlyStopping(
            monitor='val_loss',
            verbose=self.estimator_params["verbose"],
            min_delta=0,
            patience=4,
            mode='auto')
        """
        Fits the training data and labels to the appropriate model

        Args
        ----
        input : list
        labels: np.ndarray
        """

        optimizer = OPTIMIZERS[self.estimator_params["optimizer"]]
        # Here we fit the model:

        is_primal_model = self.estimator_params["primal_model"]

        if is_primal_model:
            self.model.compile(
                optimizer(lr=self.estimator_params["learning_rate"]), loss=self.loss)
            self.model.fit(
                input,
                labels,
                epochs=16,
                verbose=self.estimator_params["verbose"],
                shuffle=True,
                batch_size=self.estimator_params["batch_size"],
                validation_split=0.1,
                callbacks=[callback])
        else:

            self.model.compile(
                optimizer(lr=self.estimator_params["learning_rate"]),
                loss=[self.loss, mae_cnn_accum_loss],
                loss_weights=[1, 0])

            self.model.fit(
                input,
                labels,
                epochs=self.estimator_params["epochs"],
                verbose=self.estimator_params["verbose"],
                shuffle=True,
                batch_size=self.estimator_params["batch_size"],
                validation_split=0.1,
                callbacks=[callback])

            # self.model.compile(
            #     optimizer(lr=self.estimator_params["learning_rate"] * 0.01), loss=[self.loss, mae_cnn_accum_loss], \
            #  loss_weights=[30, 1])
            # self.model.fit(
            #     input,
            #     labels,
            #     epochs=self.estimator_params["epochs"],
            #     verbose=self.estimator_params["verbose"],
            #     shuffle=True,
            #     batch_size=self.estimator_params["batch_size"],
            #     validation_split=0.1,
            #     callbacks=[callback])

    @staticmethod
    def __accumulate_labels(labels):
        accumulation_matrix = createSumAccumulator(labels.shape[2])
        accum_labels = np.empty(labels.shape)
        for i in range(labels.shape[0]):
            for j in range(labels.shape[1]):
                accum_labels[i, j, :] = np.dot(
                    labels[i, j, :], accumulation_matrix)

        return accum_labels

    def fit_predict(self, X, y):
        """
        Initializes the model, prepares the input, fits the model and produces results with
        appropriate transformations.

        Args
        ----
        X: list
        y: ndarray

        Returns
        -------
        results :
            Prediction results
        """

        self.__initialize_model(X, y)

        instances_length = len(X["present_indices"])

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input, labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X, y)

        is_primal_model = self.estimator_params["primal_model"]

        if is_primal_model:
            input = [minute_input, day_input, seasonal_input,
                     mv_present_input, filtered_cv_present_input]
        else:
            input = [mv_sensor_input, minute_input, day_input, seasonal_input, mv_present_input,
                     filtered_cv_present_input]

        # Here we fit the model:
        self.__fit(
            input, [labels, CNNForecaster.__accumulate_labels(np.abs(labels))])

        scaled_results = self.model.predict(
            input) if is_primal_model else self.model.predict(input)[0]

        results = np.empty(
            (instances_length, scaled_results.shape[1], scaled_results.shape[2]))

        # Augmentation offset
        aug_offset = scaled_results.shape[0] - instances_length

        for i in range(instances_length):
            for j in range(results.shape[2]):
                results[i, :, j] = self.transformer.inverse_transform(np.reshape(scaled_results[i + aug_offset, :, j],
                                                                                 (1, scaled_results.shape[1])))

        return results

    def fit(self, X, y):
        """
        Prepares the correct input set and calls fitting function.

        Args
        ----
        X : list
        y: np.ndarray
        """
        self.__initialize_model(X, y)

        (mv_sensor_input, minute_input, day_input, seasonal_input,
         filtered_cv_present_input, mv_present_input, labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X, y)

        is_primal_model = self.estimator_params["primal_model"]

        if is_primal_model:
            input = [minute_input, day_input, seasonal_input,
                     mv_present_input, filtered_cv_present_input]
        else:
            input = [mv_sensor_input, minute_input, day_input,
                     seasonal_input, mv_present_input, filtered_cv_present_input]

        self.__fit(
            input, [labels, CNNForecaster.__accumulate_labels(np.abs(labels))])

        return self

    def predict(self, X):
        """
        Produces results based on already trained model.

        Args
        ----
        X: list

        Returns
        -------
        results :
            Prediction results.
        """

        (cv_sensor_input, mv_sensor_input, minute_input, day_input, seasonal_input,
         filtered_cv_present_input, mv_present_input, labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X)

        is_primal_model = self.estimator_params["primal_model"]

        if is_primal_model:
            input = [minute_input, day_input, seasonal_input,
                     mv_present_input, filtered_cv_present_input]
        else:
            input = [mv_sensor_input, minute_input, day_input,
                     seasonal_input, mv_present_input, filtered_cv_present_input]

        scaled_results = self.model.predict(
            input) if is_primal_model else self.model.predict(input)[0]
        results = np.empty(scaled_results.shape)

        for i in range(results.shape[0]):
            for j in range(results.shape[2]):

                results[i, :, j] = self.transformer.inverse_transform(np.reshape(scaled_results[i, :, j],
                                                                                 (1, scaled_results.shape[1])))

        return results

    def get_params(self):
        return self.model.get_config()


class LSTMForecaster(BaseEstimator):
    """
    Recurrent Neural Networks-based LSTM Estimator

    Attributes
    ----------
    **estimator_params : mult
        Data manipulation parameters, Model-specific parameters and hyperparameters
        for controlling the model architecture and NN learning process.

    Methods
    -------
    design_model :
        Refined model design.
    __initialize_model :
        Assigns and initializes the relevant parameters in the model design process.
    __fit :
        Fits the training data and labels to the appropriate model.
    fit_predict :
        Initializes the model, prepares the input, fits the model and produces results with
        appropriate transformations.
    fit :
        Prepares the correct input set and calls fitting function.
    predict :
        Produces results based on already trained model.
    """

    def __init__(self, **estimator_params):
        self.estimator_params = estimator_params

        self.loss = LOSS[self.estimator_params["loss"]]

        alpha = self.estimator_params["exp_smooth_alpha"]
        if alpha > 1 or alpha <= 0:
            raise ValueError(
                "Alpha should be between 0 and 1 for Exp Smothing.")

        preprocessing_steps = []
        if "label_transformers" in self.estimator_params and len(estimator_params["label_transformers"]) > 0:
            for transformer_name in estimator_params["label_transformers"]:
                if transformer_name in LABEL_TRANSFORMERS:
                    preprocessing_steps.append(
                        (transformer_name, LABEL_TRANSFORMERS[transformer_name]()))

        if len(preprocessing_steps) == 0:
            preprocessing_steps.append(
                ("blank_transformer", BlankTransformer()))
        self.transformer = Pipeline(preprocessing_steps)

    def design_model(self,
                     horizon_length,
                     mv_variables_length,
                     cv_variables_length,
                     mv_history_length,
                     cv_history_length,
                     h_dim,
                     drop_out_rate,
                     reg_penalty):
        """Refined model design

                Args
        ----
        horizon_length : int
            The number of future timesteps we are predicting for.
        mv_variables_length : int
            The number of MV variables that are about to be used.
        cv_variables_length: int
            The number of CV variables that are about to be used.
        mv_history_length : int
            The number of past timesteps of MV variables we are using as input.
        cv_history_length: int
            The number of past timesteps of CV variables we are using as input.
        drop_out_rate: float
            Drop out rate used as hyperparameter
        reg_penalty: float
            Regularization penalty used as hyperparameter
        h_dim: int
            Hidden dimensions, a number signifying the depth of the DL model.

        Returns
        -------
        model
            The model object."""

        h_dim = self.estimator_params["h_dim"]
        get_custom_objects().update({'gelu': Activation(gelu)})

        # Prepare minute input.
        minute_input = Input(shape=(1))

        minute_layer = Reshape((cv_variables_length, 3))(
            Embedding(24, 3)(minute_input))
        minute_layer = Dense(1, activation='relu')(minute_layer)
        minute_layer = Flatten()(minute_layer)

        minute_layer_mv = RepeatVector(mv_history_length + 1)(minute_layer)
        minute_layer_cv = RepeatVector(cv_history_length + 1)(minute_layer)

        # Prepare day of the week input
        day_input = Input(shape=(1, 1))
        day_layer = Reshape((cv_variables_length, 3))(
            Embedding(7, 3)(day_input))
        day_layer = Dense(1, activation='relu')(day_layer)
        day_layer = Flatten()(day_layer)

        day_layer_mv = RepeatVector(mv_history_length + 1)(day_layer)
        day_layer_cv = RepeatVector(cv_history_length + 1)(day_layer)

        seasonal_input = Input(shape=(1, 1))
        seasonal_layer = Reshape((cv_variables_length, 3))(
            Embedding(12, 3)(seasonal_input))
        seasonal_layer = Dense(1, activation='relu')(seasonal_layer)
        seasonal_layer = Flatten()(seasonal_layer)

        seasonal_layer_mv = RepeatVector(mv_history_length + 1)(seasonal_layer)
        seasonal_layer_cv = RepeatVector(cv_history_length + 1)(seasonal_layer)

        # Prepare MV input.
        mv_sensor_input = Input(
            shape=(mv_variables_length, mv_history_length))

        # Prepare present MV input
        present_mv_input = Input(shape=(mv_variables_length))
        present_mv_layer = Reshape((mv_variables_length, 1))(present_mv_input)

        total_layer_mv = concatenate(
            [mv_sensor_input, present_mv_layer], axis=2)
        # TODO: Don't Permute here, instead Permute time layers.
        total_layer_mv = Permute((2, 1))(total_layer_mv)
        total_layer_mv = concatenate(
            [total_layer_mv, minute_layer_mv, day_layer_mv, seasonal_layer_mv], axis=2)

        # Prepare CV input.
        cv_sensor_input = Input(
            shape=(cv_variables_length, cv_history_length))

        # Prepare present CV input.
        present_cv_input = Input(shape=(cv_variables_length))
        present_cv_layer = Reshape((cv_variables_length, 1))(present_cv_input)

        total_layer_cv = concatenate(
            [cv_sensor_input, present_cv_layer], axis=2)
        total_layer_cv = Permute((2, 1))(total_layer_cv)
        total_layer_cv = concatenate(
            [total_layer_cv, minute_layer_cv, day_layer_cv, seasonal_layer_cv], axis=2)

        lstm_mv = LSTM(units=2*h_dim,
                       activation="tanh",
                       return_sequences=True)(total_layer_mv)

        lstm_cv = LSTM(units=2*h_dim,
                       activation="tanh")(total_layer_cv)

        lstm_horizon_cv = RepeatVector(horizon_length)(lstm_cv)

        lstm_horizon_cv = LSTM(units=h_dim,
                               activation="tanh",
                               return_sequences=True)(lstm_horizon_cv)

        cv_x = TimeDistributed(
            Dense(h_dim*4, activation="relu"))(lstm_horizon_cv)
        cv_x = TimeDistributed(Dense(h_dim, activation="relu"))(cv_x)

        mv_x = TimeDistributed(Dense(h_dim, activation="relu"))(lstm_mv)
        mv_x = Reshape((1, mv_x.shape[1] * mv_x.shape[2]))(mv_x)

        x_mv = TimeDistributed(
            Dense(horizon_length, activation='sigmoid'))(mv_x)
        x_cv = TimeDistributed(Dense(1, activation='sigmoid'))(cv_x)
        x_cv = Permute((2, 1))(x_cv)
        x = Add()([x_cv, x_mv])

        model = Model([cv_sensor_input, present_cv_input, mv_sensor_input, present_mv_input, minute_input, day_input,
                       seasonal_input],
                      [x, x_mv, x_cv])

        return model

    def __initialize_model(self, X, y):
        """
        Assigns and initializes the relevant parameters in the model design process.
        """
        cv_history_length = self.estimator_params["cv_history_length"]
        mv_history_length = self.estimator_params["mv_history_length"]
        mv_variables_length = len(self.estimator_params["mv_variables"]) \
            if "mv_variables" in self.estimator_params else 0

        horizon_length = self.estimator_params["horizon_length"]
        cv_variables = self.estimator_params["variables"]

        # Here we define the model:
        drop_out_rate = self.estimator_params["drop_out_rate"]
        reg_penalty = self.estimator_params["reg_penalty"]
        h_dim = self.estimator_params["h_dim"]

        self.model = \
            self.design_model(horizon_length=horizon_length,
                              mv_variables_length=mv_variables_length,
                              cv_variables_length=len(cv_variables),
                              mv_history_length=mv_history_length,
                              cv_history_length=cv_history_length,
                              h_dim=h_dim,
                              drop_out_rate=drop_out_rate,
                              reg_penalty=reg_penalty)

        if(self.estimator_params["verbose"] == 2):
            print(f"{self.model.summary()}")

    def __fit(self, input: List[np.ndarray], labels: np.ndarray):
        """
        Fits the training data and labels to the appropriate model

        Args
        ----
        input : list
        labels: np.ndarray
        """

        callback = EarlyStopping(
            monitor='val_loss',
            verbose=self.estimator_params["verbose"],
            min_delta=0,
            patience=10,
            mode='auto')

        optimizer = OPTIMIZERS[self.estimator_params["optimizer"]]
        # Here we fit the model:
        self.model.compile(
            optimizer(lr=self.estimator_params["learning_rate"]),
            loss=[self.loss, self.loss, self.loss],
            loss_weights=[1, 1, 1])

        self.model.fit(
            input,
            [labels, labels * 0.05, labels * 0.95],
            epochs=self.estimator_params["epochs"],
            verbose=self.estimator_params["verbose"],
            shuffle=True,
            batch_size=self.estimator_params["batch_size"],
            validation_split=0.1,
            callbacks=[callback])

    def fit(self, X, y):
        """
        Prepares the correct input set and calls fitting function.

        Args
        ----
        X : list
        y: np.ndarray
        """

        self.__initialize_model(X, y)

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X, y)

        input = [cv_sensor_input, filtered_cv_present_input, mv_sensor_input,
                 mv_present_input, minute_input, day_input, seasonal_input]

        mv_input_min_limit, mv_input_max_limit = \
            extract_input_mv_limits(np.concatenate([mv_sensor_input, np.expand_dims(mv_present_input, axis=2)], axis=2),
                                    self.estimator_params["mv_variables"])

        self.mv_diff_input_min_limit = mv_input_min_limit
        self.mv_diff_input_max_limit = mv_input_max_limit

        self.__fit(input, labels)

        return self

    def predict(self, X):
        """
        Produces results based on already trained model.

        Args
        ----
        X: list

        Returns
        -------
        results :
            Prediction results.
        """

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X)

        input = [cv_sensor_input, filtered_cv_present_input, mv_sensor_input,
                 mv_present_input, minute_input, day_input, seasonal_input]

        scaled_results = self.model.predict(input)[0]
        results = np.empty(scaled_results.shape)

        for i in range(results.shape[0]):
            for j in range(results.shape[2]):

                results[i, :, j] = self.transformer.inverse_transform(np.reshape(scaled_results[i, :, j],
                                                                      (1, scaled_results.shape[1])))
        return results

    def is_input_within_limits(self, X):
        """
        Checks whether the present MVs are within their appropriate thresholds

        Args
        ----
        X : list
            All inputs
        """
        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X, None)

        tags_to_index = self.estimator_params["tags_to_index"]

        mv_variables = self.estimator_params["mv_variables"] if "mv_variables" in self.estimator_params \
            else tags_to_index.keys()

        for i, tag in enumerate(mv_variables):
            present_value = mv_present_input[0, i]
            past_values = mv_sensor_input[:, i]

            value = (present_value + past_values.sum()) / \
                (past_values.shape[0] + 1)

            any_limi_violation = self.mv_diff_input_min_limit[
                tag] > value or self.mv_diff_input_max_limit[tag] < value

            if any_limi_violation:
                return False
        return True

    def fit_predict(self, X, y):
        """
        Initializes the model, prepares the input, fits the model and produces results with
        appropriate transformations.

        Args
        ----
        X: list
        y: ndarray

        Returns
        -------
        results :
            Prediction results
        """

        instances_length = len(X["present_indices"])

        self.__initialize_model(X, y)

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X, y)

        input = [cv_sensor_input, filtered_cv_present_input, mv_sensor_input,
                 mv_present_input, minute_input, day_input, seasonal_input]

        mv_input_min_limit, mv_input_max_limit = \
            extract_input_mv_limits(np.concatenate([mv_sensor_input, np.expand_dims(mv_present_input, axis=2)], axis=2),
                                    self.estimator_params["mv_variables"])

        self.mv_diff_input_min_limit = mv_input_min_limit
        self.mv_diff_input_max_limit = mv_input_max_limit

        # Here we fit the model:
        self.__fit(input, labels)

        scaled_results = self.model.predict(input)[0]
        results = np.empty(
            (instances_length, scaled_results.shape[1], scaled_results.shape[2]))

        # Augmentation offset
        aug_offset = scaled_results.shape[0] - instances_length

        for i in range(instances_length):
            for j in range(results.shape[2]):
                results[i, :, j] = self.transformer.inverse_transform(np.reshape(scaled_results[i + aug_offset, :, j],
                                                                                 (1, scaled_results.shape[1])))

        return results

    def get_params(self):
        return self.model.get_config()

class LinearForecaster(BaseEstimator):
    """
    Elastic Net Linear Estimator

    Attributes
    ----------
    **estimator_params : mult
        Data manipulation parameters, Model-specific parameters and hyperparameters
        for controlling the model robustnes and training.

    Methods
    -------
    design_model :
        Refined model design.
    __initialize_model :
        Assigns and initializes the relevant parameters in the model design process.
    __fit :
        Fits the training data and labels to the appropriate model.
    fit_predict :
        Initializes the model, prepares the input, fits the model and produces results with
        appropriate transformations.
    fit :
        Prepares the correct input set and calls fitting function.
    predict :
        Produces results based on already trained model.
    """

    def __init__(self, **estimator_params):
        self.estimator_params = estimator_params

        alpha = self.estimator_params["exp_smooth_alpha"]
        if alpha > 1 or alpha <= 0:
            raise ValueError(
                "Alpha should be between 0 and 1 for Exp Smothing.")

        preprocessing_steps = []
        if "label_transformers" in self.estimator_params and len(estimator_params["label_transformers"]) > 0:
            for transformer_name in estimator_params["label_transformers"]:
                if transformer_name in LABEL_TRANSFORMERS:
                    preprocessing_steps.append(
                        (transformer_name, LABEL_TRANSFORMERS[transformer_name]()))

        if len(preprocessing_steps) == 0:
            preprocessing_steps.append(
                ("blank_transformer", BlankTransformer()))
        self.transformer = Pipeline(preprocessing_steps)

    def __initialize_model(self, X, y):
        """
        Assigns and initializes the relevant parameters in the model design process.
        """

        self.model = Ridge(alpha=1, solver="auto")

        if(self.estimator_params["verbose"] == 2):
            print(f"{self.model.get_params()}")

    def __fit(self, input: List[np.ndarray], labels: np.ndarray):
        """
        Fits the training data and labels to the appropriate model

        Args
        ----
        input : list
        labels: np.ndarray
        """
        hook_d_outlier_removal_iteration_count = \
            self.estimator_params["hook_iterations"] if "hook_iterations" in self.estimator_params else 1

        (input, labels) = iterative_outlier_removal_hooks_d(hook_d_outlier_removal_iteration_count, input, labels)

        # Here we fit the model:
        self.model.fit(
            input,
            labels,)

    def fit(self, X, y):
        """
        Prepares the correct input set and calls fitting function.

        Args
        ----
        X : list
        y: np.ndarray
        """

        self.__initialize_model(X, y)

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X, y)

        input = np.concatenate([
            cv_sensor_input.reshape((*cv_sensor_input.shape[:-2], -1)),
            filtered_cv_present_input,
            mv_sensor_input.reshape((*mv_sensor_input.shape[:-2], -1)),
            mv_present_input,
            np.expand_dims(minute_input, axis=1),
            np.expand_dims(day_input, axis=1),
            np.expand_dims(seasonal_input, axis=1)], axis=1)

        mv_input_min_limit, mv_input_max_limit = \
            extract_input_mv_limits(np.concatenate([mv_sensor_input, np.expand_dims(mv_present_input, axis=2)], axis=2),
                                    self.estimator_params["mv_variables"])

        self.mv_diff_input_min_limit = mv_input_min_limit
        self.mv_diff_input_max_limit = mv_input_max_limit

        self.__fit(input, labels.squeeze(axis=(1, 2)))

        return self

    def predict(self, X):
        """
        Produces results based on already trained model.

        Args
        ----
        X: list

        Returns
        -------
        results :
            Prediction results.
        """

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X)

        input = np.concatenate([
            cv_sensor_input.reshape((*cv_sensor_input.shape[:-2], -1)),
            filtered_cv_present_input,
            mv_sensor_input.reshape((*mv_sensor_input.shape[:-2], -1)),
            mv_present_input,
            np.expand_dims(minute_input, axis=1),
            np.expand_dims(day_input, axis=1),
            np.expand_dims(seasonal_input, axis=1)], axis=1)

        scaled_results = np.expand_dims(self.model.predict(input), axis=1)
        results = self.transformer.inverse_transform(scaled_results)

        return np.expand_dims(results, axis=1)

    def is_input_within_limits(self, X) -> Dict[str, Tuple[float, float, float]]:
        """
        Checks whether the present MVs are within their appropriate thresholds.
        And if not it returns dictionary with keys representing the names of the sensors,
        and values tuple representing the lower limit, actual value and the upper limit.

        Args
        ----
        X : list
            All inputs
        """

        not_passing_sensors = dict()
        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(self.estimator_params, self.transformer, X, None)

        tags_to_index = self.estimator_params["tags_to_index"]

        mv_variables = self.estimator_params["mv_variables"] if "mv_variables" in self.estimator_params \
            else tags_to_index.keys()

        for i, tag in enumerate(mv_variables):
            present_value = mv_present_input[0, i]
            past_values = mv_sensor_input[:, i]

            value = (present_value + past_values.sum())/(past_values.shape[0] + 1)

            any_limi_violation = self.mv_diff_input_min_limit[tag] > value or self.mv_diff_input_max_limit[tag] < value

            if any_limi_violation:
                not_passing_sensors[tag] = (self.mv_diff_input_min_limit[tag], value, self.mv_diff_input_max_limit[tag])
        return not_passing_sensors

    def fit_predict(self, X, y):
        """
        Initializes the model, prepares the input, fits the model and produces results with
        appropriate transformations.

        Args
        ----
        X: list
        y: ndarray

        Returns
        -------
        results :
            Prediction results
        """

        instances_length = len(X["present_indices"])

        self.__initialize_model(X, y)

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X, y)

        input = np.concatenate([
            cv_sensor_input.reshape((*cv_sensor_input.shape[:-2], -1)),
            filtered_cv_present_input,
            mv_sensor_input.reshape((*mv_sensor_input.shape[:-2], -1)),
            mv_present_input,
            np.expand_dims(minute_input, axis=1),
            np.expand_dims(day_input, axis=1),
            np.expand_dims(seasonal_input, axis=1)], axis=1)

        mv_input_min_limit, mv_input_max_limit = \
            extract_input_mv_limits(np.concatenate([mv_sensor_input, np.expand_dims(mv_present_input, axis=2)], axis=2),
                                    self.estimator_params["mv_variables"])

        self.mv_diff_input_min_limit = mv_input_min_limit
        self.mv_diff_input_max_limit = mv_input_max_limit

        # Here we fit the model:
        self.__fit(input, labels.squeeze(axis=(1, 2)))

        scaled_results = self.transformer.inverse_transform(np.expand_dims(self.model.predict(input), axis=1))
        results = np.empty(
            (instances_length, scaled_results.shape[1], 1))

        # Augmentation offset
        aug_offset = scaled_results.shape[0] - instances_length

        for i in range(instances_length):
            results[i, :, 0] = scaled_results[i + aug_offset, :]

        return results

    def get_params(self):
        return self.model.get_params()


class XGBoostForecaster(BaseEstimator):
    """
    XGBoost Estimator

    Attributes
    ----------
    **estimator_params : mult
        Data manipulation parameters, Model-specific parameters and hyperparameters
        for controlling the model robustnes and training.

    Methods
    -------
    design_model :
        Refined model design.
    __initialize_model :
        Assigns and initializes the relevant parameters in the model design process.
    __fit :
        Fits the training data and labels to the appropriate model.
    fit_predict :
        Initializes the model, prepares the input, fits the model and produces results with
        appropriate transformations.
    fit :
        Prepares the correct input set and calls fitting function.
    predict :
        Produces results based on already trained model.
    """

    def __init__(self, **estimator_params):
        self.estimator_params = estimator_params

        alpha = self.estimator_params["exp_smooth_alpha"]
        if alpha > 1 or alpha <= 0:
            raise ValueError(
                "Alpha should be between 0 and 1 for Exp Smothing.")

        preprocessing_steps = []
        if "label_transformers" in self.estimator_params and len(estimator_params["label_transformers"]) > 0:
            for transformer_name in estimator_params["label_transformers"]:
                if transformer_name in LABEL_TRANSFORMERS:
                    preprocessing_steps.append(
                        (transformer_name, LABEL_TRANSFORMERS[transformer_name]()))

        if len(preprocessing_steps) == 0:
            preprocessing_steps.append(
                ("blank_transformer", BlankTransformer()))
        self.transformer = Pipeline(preprocessing_steps)

    def __initialize_model(self, X, y):
        """
        Assigns and initializes the relevant parameters in the model design process.
        """

        hyper_para = dict(self.estimator_params)
        del hyper_para["near_zero_tolerance"]
        del hyper_para["retain_zero_ratio"]
        del hyper_para["api_model_kind"]
        del hyper_para["stride"]
        del hyper_para["cv_history_length"]
        del hyper_para["mv_history_length"]
        del hyper_para["horizon_length"]
        del hyper_para["random_probing"]
        del hyper_para["label_lag"]
        del hyper_para["predict_diff"]
        if "max_excess_oxygen_limit" in hyper_para:
            del hyper_para["max_excess_oxygen_limit"]
        if "min_excess_oxygen_limit" in hyper_para:
            del hyper_para["min_excess_oxygen_limit"]
        del hyper_para["exp_smooth_alpha"]
        del hyper_para["augment_factor"]
        del hyper_para["top_mv_diffs_ratio"]
        if "labels_moving_average_window" in hyper_para:
            del hyper_para["labels_moving_average_window"]
        del hyper_para["mv_variables"]
        del hyper_para["verbose"]
        del hyper_para["hook_iterations"]

        self.model = xgb.XGBRegressor(**hyper_para)

        if(self.estimator_params["verbose"] == 2):
            print(f"{self.model.get_params()}")

    def __fit(self, input: List[np.ndarray], labels: np.ndarray):
        """
        Fits the training data and labels to the appropriate model

        Args
        ----
        input : list
        labels: np.ndarray
        """
        hook_d_outlier_removal_iteration_count = \
            self.estimator_params["hook_iterations"] if "hook_iterations" in self.estimator_params else 1

        (input, labels) = iterative_outlier_removal_hooks_d(hook_d_outlier_removal_iteration_count, input, labels)

        # Here we fit the model:
        self.model.fit(
            input,
            labels,)

    def fit(self, X, y):
        """
        Prepares the correct input set and calls fitting function.

        Args
        ----
        X : list
        y: np.ndarray
        """

        self.__initialize_model(X, y)

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X, y)

        input = np.concatenate([
            cv_sensor_input.reshape((*cv_sensor_input.shape[:-2], -1)),
            filtered_cv_present_input,
            mv_sensor_input.reshape((*mv_sensor_input.shape[:-2], -1)),
            mv_present_input,
            np.expand_dims(minute_input, axis=1),
            np.expand_dims(day_input, axis=1),
            np.expand_dims(seasonal_input, axis=1)], axis=1)

        mv_input_min_limit, mv_input_max_limit = \
            extract_input_mv_limits(np.concatenate([mv_sensor_input, np.expand_dims(mv_present_input, axis=2)], axis=2),
                                    self.estimator_params["mv_variables"])

        self.mv_diff_input_min_limit = mv_input_min_limit
        self.mv_diff_input_max_limit = mv_input_max_limit

        self.__fit(input, labels.squeeze(axis=(1, 2)))

        return self

    def predict(self, X):
        """
        Produces results based on already trained model.

        Args
        ----
        X: list

        Returns
        -------
        results :
            Prediction results.
        """

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X)

        input = np.concatenate([
            cv_sensor_input.reshape((*cv_sensor_input.shape[:-2], -1)),
            filtered_cv_present_input,
            mv_sensor_input.reshape((*mv_sensor_input.shape[:-2], -1)),
            mv_present_input,
            np.expand_dims(minute_input, axis=1),
            np.expand_dims(day_input, axis=1),
            np.expand_dims(seasonal_input, axis=1)], axis=1)

        scaled_results = np.expand_dims(self.model.predict(input), axis=1)
        results = self.transformer.inverse_transform(scaled_results)

        return np.expand_dims(results, axis=1)

    def is_input_within_limits(self, X) -> Dict[str, Tuple[float, float, float]]:
        """
        Checks whether the present MVs are within their appropriate thresholds.
        And if not it returns dictionary with keys representing the names of the sensors,
        and values tuple representing the lower limit, actual value and the upper limit.

        Args
        ----
        X : list
            All inputs
        """

        not_passing_sensors = dict()
        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(self.estimator_params, self.transformer, X, None)

        tags_to_index = self.estimator_params["tags_to_index"]

        mv_variables = self.estimator_params["mv_variables"] if "mv_variables" in self.estimator_params \
            else tags_to_index.keys()

        for i, tag in enumerate(mv_variables):
            present_value = mv_present_input[0, i]
            past_values = mv_sensor_input[:, i]

            value = (present_value + past_values.sum())/(past_values.shape[0] + 1)

            any_limi_violation = self.mv_diff_input_min_limit[tag] > value or self.mv_diff_input_max_limit[tag] < value

            if any_limi_violation:
                not_passing_sensors[tag] = (self.mv_diff_input_min_limit[tag], value, self.mv_diff_input_max_limit[tag])
        return not_passing_sensors

    def fit_predict(self, X, y):
        """
        Initializes the model, prepares the input, fits the model and produces results with
        appropriate transformations.

        Args
        ----
        X: list
        y: ndarray

        Returns
        -------
        results :
            Prediction results
        """

        instances_length = len(X["present_indices"])

        self.__initialize_model(X, y)

        (cv_sensor_input, mv_sensor_input, minute_input, day_input,
         seasonal_input, filtered_cv_present_input, mv_present_input,
         labels) = \
            _extract_input_and_labels(
                self.estimator_params, self.transformer, X, y)

        input = np.concatenate([
            cv_sensor_input.reshape((*cv_sensor_input.shape[:-2], -1)),
            filtered_cv_present_input,
            mv_sensor_input.reshape((*mv_sensor_input.shape[:-2], -1)),
            mv_present_input,
            np.expand_dims(minute_input, axis=1),
            np.expand_dims(day_input, axis=1),
            np.expand_dims(seasonal_input, axis=1)], axis=1)

        mv_input_min_limit, mv_input_max_limit = \
            extract_input_mv_limits(np.concatenate([mv_sensor_input, np.expand_dims(mv_present_input, axis=2)], axis=2),
                                    self.estimator_params["mv_variables"])

        self.mv_diff_input_min_limit = mv_input_min_limit
        self.mv_diff_input_max_limit = mv_input_max_limit

        # Here we fit the model:
        self.__fit(input, labels.squeeze(axis=(1, 2)))

        scaled_results = self.transformer.inverse_transform(np.expand_dims(self.model.predict(input), axis=1))
        results = np.empty(
            (instances_length, scaled_results.shape[1], 1))

        # Augmentation offset
        aug_offset = scaled_results.shape[0] - instances_length

        for i in range(instances_length):
            results[i, :, 0] = scaled_results[i + aug_offset, :]

        return results

    def get_params(self):
        return self.model.get_params()

class NaiveForecasting(BaseEstimator):
    """Wrapper for naive forecaster which predicts the mean for the particular minute."""

    def __init__(self, **estimator_params):

        self.estimator_params = estimator_params
        minute_wise = estimator_params['minute_wise']
        self.estimator_params['minute_wise'] = \
            minute_wise if minute_wise is not None else False

        self.means: Union[Dict[str, float],
                          Dict[str, Dict[int, float]]] = dict()

    def set_params(self, **params):
        for para_key, para_value in params.items():
            self.estimator_params[para_key] = para_value
        return

    def get_params(self, **params):
        return self.estimator_params

    def fit(self, X: np.ndarray, y: np.ndarray):

        train_indices = X["present_indices"]
        cv_variables = self.estimator_params["variables"]
        tags_to_index = self.estimator_params["tags_to_index"]
        minute_wise = self.estimator_params['minute_wise']

        if minute_wise:
            minutes = X[MINUTE_INPUT_KIND]

            for cv_index, cv_name in enumerate(cv_variables):
                means_count: Dict[int, int] = dict()

                variable_values = y[:, tags_to_index[cv_name]]
                self.means[cv_name] = dict()
                means = self.means[cv_name]

                for i in train_indices:
                    minute = minutes[i, 0]
                    if minute in means:
                        means[minute] += variable_values[i]
                        means_count[minute] += 1
                    else:
                        means[minute] = variable_values[i]
                        means_count[minute] = 1

                total_mean = sum(list(means.values())) / sum(list(means_count))

                for minute in means.keys():
                    count = means_count[minute]
                    if count == 0:
                        means[minute] = total_mean
                    else:
                        means[minute] /= count
        else:
            for cv_name in cv_variables:
                variable_values = y[tags_to_index[cv_name]]
                self.means[cv_name] = np.mean(variable_values)

    def fit_predict(self, X, y):
        self.fit(X, y)
        return self.predict(X)

    def predict(self, X):
        present_indices = X["present_indices"]
        horizon = self.estimator_params["horizon_length"]
        minutes = X[MINUTE_INPUT_KIND]
        cv_variables = self.estimator_params["variables"]

        y = np.empty((len(present_indices), len(cv_variables), horizon))

        if self.estimator_params['minute_wise']:
            for i in range(len(cv_variables)):
                cv_name = cv_variables[i]

                values = list(self.means[cv_name].values())
                total_mean = sum(values) / len(values)

                for j in range(len(present_indices)):
                    original_index = present_indices[j]
                    means = self.means[cv_name]
                    mean = means[minutes[original_index, 0]
                                 ] if minutes[original_index, 0] in means else total_mean
                    y[j, i, :] = np.full((1, 1, horizon), mean)
        else:
            for i in range(len(cv_variables)):
                cv_name = cv_variables[i]

                y[:, i, :] = np.full(
                    (y.shape[0], horizon), self.means[cv_name])

        return y


def _extract_input_and_labels(
        estimator_params: Dict[str, Union[str, bool, int, float, None]],
        transformer,
        X: np.ndarray,
        y: Optional[np.ndarray] = None):

    if "sample_frequency" not in estimator_params:
        sample_frequency = 1
    else:
        sample_frequency = estimator_params["sample_frequency"]

    sample_frequency_reminder = 1440 % sample_frequency

    present_indices = X[PRESENT_INDICES]

    present_input = X[PRESENT_INPUT]
    sensors = X[SENSOR_INPUT_KIND]
    cv_history_length = estimator_params["cv_history_length"]

    mv_history_length = estimator_params["mv_history_length"]

    minutes_x = X[MINUTE_INPUT_KIND]
    days_x = X[DAY_INPUT_KIND]

    label_lag = estimator_params["label_lag"]

    horizon_length = estimator_params["horizon_length"] if y is not None else 0
    tags_to_index = estimator_params["tags_to_index"]
    cv_variables = estimator_params["variables"]
    mv_variables = estimator_params["mv_variables"] if "mv_variables" in estimator_params else tags_to_index.keys(
    )

    alpha = estimator_params["exp_smooth_alpha"]

    filtered_cv_present_input = np.empty(
        (present_input.shape[0],  len(cv_variables)))
    filtered_cv_sensors = np.empty(
        (sensors.shape[0],  len(cv_variables)))

    filtered_mv_present_input = np.empty(
        (present_input.shape[0],  len(mv_variables)))
    filtered_mv_sensors = np.empty(
        (sensors.shape[0],  len(mv_variables)))

    for i, mv_name in enumerate(mv_variables):
        filtered_mv_sensors[:, i] = sensors[:, tags_to_index[mv_name]]
        filtered_mv_present_input[:,
                                  i] = present_input[:, tags_to_index[mv_name]]

    if y is not None:
        # We use filtered_y for labels
        filtered_y = np.empty(
            (y.shape[0], len(cv_variables)))

        for i, cv_name in enumerate(cv_variables):
            filtered_y[:, i] = y[:, tags_to_index[cv_name]]
            filtered_cv_sensors[:, i] = sensors[:, tags_to_index[cv_name]]
            filtered_cv_present_input[:,
                                      i] = present_input[:, tags_to_index[cv_name]]
    else:
        for i, cv_name in enumerate(cv_variables):
            filtered_cv_sensors[:, i] = sensors[:, tags_to_index[cv_name]]
            filtered_cv_present_input[:,
                                      i] = present_input[:, tags_to_index[cv_name]]

    minute_input = np.empty((len(present_indices))
                            ) if minutes_x is not None else None

    day_input = np.empty((len(present_indices))
                         ) if days_x is not None else None

    seasonal_input = np.empty((len(present_indices))
                              ) if day_input is not None else None

    cv_sensor_input = np.zeros(
        (len(present_indices), filtered_cv_sensors.shape[1], cv_history_length))

    cv_smoothed_present_input = np.zeros(filtered_cv_present_input.shape)

    mv_sensor_input = np.zeros(
        (len(present_indices), filtered_mv_sensors.shape[1], mv_history_length))

    mv_smoothed_present_input = np.zeros(filtered_mv_present_input.shape)

    labels = np.empty(
        (len(present_indices), filtered_y.shape[1], horizon_length)) if y is not None else None

    # outliers_mask = np.ones((len(present_indices), len(
    #     cv_variables), self.estimator_params["horizon_length"]))

    successive_mins_count = list()
    successive_mins_counter = 0
    prev_day = days_x[0]
    prev_min = minutes_x[0]

    for i in range(len(days_x)):
        min_diff = minutes_x[i] - prev_min
        day_diff = days_x[i] - prev_day
        if (day_diff == 0 or day_diff == 1) and \
           (min_diff == sample_frequency or min_diff == (-1440 + sample_frequency_reminder)):

            successive_mins_counter += 1
            successive_mins_count.append(successive_mins_counter)
        else:
            successive_mins_counter = 1
            successive_mins_count.append(successive_mins_counter)
        prev_day = days_x[i]
        prev_min = minutes_x[i]

    minutes_transformer = MinutesToHour()
    days_transformer = DayToPeriod()
    seasonal_transformer = DayToSeasonal()

    minutes_x = minutes_transformer.transform(
        minutes_x.reshape((minutes_x.shape[0], 1)))
    minutes_x = np.squeeze(minutes_x)

    days_x = days_transformer.transform(days_x.reshape((days_x.shape[0], 1)))
    days_x = np.squeeze(days_x)

    seasons_x = seasonal_transformer.transform(
        days_x.reshape((days_x.shape[0], 1)))
    seasons_x = np.squeeze(seasons_x)

    for i, present_index in enumerate(present_indices):
        if minutes_x is not None:
            minute_input[i] = minutes_x[present_index]
        if days_x is not None:
            day_input[i] = days_x[present_index]
            seasonal_input[i] = seasons_x[present_index]

        successive_mins_cutoff = successive_mins_count[present_index]

        # Initialize the exp smoothing value for the cv
        alpha_t = 1
        s_t = np.zeros(filtered_cv_present_input[i, :].shape)
        one_minus_alpha_t = 1 - alpha

        for j in range(max(cv_history_length - successive_mins_cutoff, 0), cv_history_length):
            k = present_index - cv_history_length + j
            cv_sensor_input[i, :, j] = filtered_cv_sensors[k, :]

            s_t = alpha_t * cv_sensor_input[i, :, j] + one_minus_alpha_t * s_t
            alpha_t = alpha

        s_t = alpha * filtered_cv_present_input[i, :] + one_minus_alpha_t * s_t
        cv_smoothed_present_input[i, :] = s_t

        # Initialize the exp smoothing value for the mv
        alpha_t = 1
        s_t = np.zeros(filtered_mv_present_input[i, :].shape)
        one_minus_alpha_t = 1 - alpha

        for j in range(max(mv_history_length - successive_mins_cutoff, 0), mv_history_length - 1):
            k = present_index - mv_history_length + j
            mv_sensor_input[i, :, j] = filtered_mv_sensors[k,
                                                           :] - filtered_mv_sensors[k + 1, :]

            s_t = alpha_t * filtered_mv_sensors[k, :] + one_minus_alpha_t * s_t
            alpha_t = alpha

        mv_sensor_input[i, :, mv_history_length - 1] = \
            filtered_mv_sensors[present_index - 1, :] - \
            filtered_mv_present_input[i, :]

        s_t = alpha * filtered_mv_present_input[i, :] + one_minus_alpha_t * s_t
        mv_smoothed_present_input[i, :] = s_t

        label_offset_index = present_index + 1

        for j in range(horizon_length):
            # If label lag >= 1 it means that the horizon length is 1 and j is alawys 0
            t = j if label_lag < 1 else label_lag - 1
            labels[i, :, j] = filtered_y[label_offset_index + t, :]

        # if y is not None:
            # label_values = labels[i, :, :]
            # mean = np.mean(label_values)
            # std = np.std(label_values)
            # min_limit = mean - (std * cap_magnitude)
            # max_limit = mean + (std * cap_magnitude)
            # outliers_mask[i, :, :] = \
            #     np.where((label_values < min_limit) | (
            #         label_values > max_limit), 0, outliers_mask[i, :, :])

            # labels[i, :, :] = label_values

    augmented_mv_smoothed_present_input = list()
    augmented_cv_smoothed_present_input = list()
    augmented_cv_sensor_inputs = list()
    augmented_mv_sensor_inputs = list()
    augmented_minute_inputs = list()
    augmented_day_inputs = list()
    augmented_season_inputs = list()

    if y is not None:
        squeezed_labels = np.reshape(labels.swapaxes(
            1, 2), (labels.shape[0] * labels.shape[2], labels.shape[1]))

        transformer.fit(squeezed_labels)

        squeezed_labels = transformer.transform(squeezed_labels)

        labels = np.reshape(
            squeezed_labels, (labels.shape[0], labels.shape[2], labels.shape[1])).swapaxes(1, 2)

        augmented_labels = list()

        augment_factor = estimator_params["augment_factor"]
        augment_ratio = estimator_params["top_mv_diffs_ratio"]

        largest_mv_diff_indices = get_top_mv_diff_indices(
            n=int(mv_smoothed_present_input.shape[0] * augment_ratio),
            mv_diff_data=mv_smoothed_present_input,
            tags_to_index_mv=tags_to_index)

        for i in largest_mv_diff_indices:
            augmented_labels.append(
                np.full((augment_factor, labels.shape[1], labels.shape[2]), labels[i]))
            augmented_cv_sensor_inputs.append(
                np.full((augment_factor, cv_sensor_input.shape[1], cv_sensor_input.shape[2]), cv_sensor_input[i, :, :]))
            augmented_mv_sensor_inputs.append(
                np.full((augment_factor, mv_sensor_input.shape[1], mv_sensor_input.shape[2]), mv_sensor_input[i, :, :]))
            augmented_cv_smoothed_present_input.append(
                np.full((augment_factor, cv_smoothed_present_input.shape[1]), cv_smoothed_present_input[i, :]))
            augmented_mv_smoothed_present_input.append(
                np.full((augment_factor, mv_smoothed_present_input.shape[1]), mv_smoothed_present_input[i, :]))
            augmented_minute_inputs.append(
                np.full((augment_factor, ), minute_input[i]))
            augmented_day_inputs.append(
                np.full((augment_factor, ), day_input[i]))
            augmented_season_inputs.append(
                np.full((augment_factor, ), seasonal_input[i]))

        augmented_labels.append(labels)
        labels = np.concatenate(augmented_labels)

        # outliers_mask = np.reshape(
        #     outliers_mask, (labels.shape[0], labels.shape[2], labels.shape[1])).swapaxes(1, 2)

    augmented_cv_sensor_inputs.append(cv_sensor_input)
    augmented_mv_sensor_inputs.append(mv_sensor_input)
    augmented_cv_smoothed_present_input.append(cv_smoothed_present_input)
    augmented_mv_smoothed_present_input.append(mv_smoothed_present_input)
    augmented_minute_inputs.append(minute_input)
    augmented_day_inputs.append(day_input)
    augmented_season_inputs.append(seasonal_input)

    cv_sensor_input = np.concatenate(augmented_cv_sensor_inputs)
    mv_sensor_input = np.concatenate(augmented_mv_sensor_inputs)
    cv_smoothed_present_input = np.concatenate(
        augmented_cv_smoothed_present_input)
    mv_smoothed_present_input = np.concatenate(
        augmented_mv_smoothed_present_input)
    minute_input = np.concatenate(augmented_minute_inputs)
    day_input = np.concatenate(augmented_day_inputs)
    seasonal_input = np.concatenate(augmented_season_inputs)

    return (cv_sensor_input, mv_sensor_input, minute_input, day_input, seasonal_input, cv_smoothed_present_input,
            mv_smoothed_present_input, labels)

def iterative_outlier_removal_hooks_d(iterations_count, X_li, y_li):
    for i in range(iterations_count):
        visualizer = CooksDistance()
        visualizer.fit(X_li, y_li)
        i_less_influential = (visualizer.distance_ <= visualizer.influence_threshold_)
        X_li, y_li = X_li[i_less_influential], y_li[i_less_influential]
    return X_li, y_li


def extract_input_mv_limits(mv_input: np.ndarray, mv_tags: List[str]):
    stds = mv_input.std(axis=(0, 2))
    means = mv_input.mean(axis=(0, 2))

    mv_input_min_limit = dict()
    mv_input_max_limit = dict()
    for i, tag in enumerate(mv_tags):
        mv_input_min_limit[tag] = means[i] - MV_INPUT_LIMIT_MAGNITUDE * stds[i]
        mv_input_max_limit[tag] = means[i] + MV_INPUT_LIMIT_MAGNITUDE * stds[i]

    return mv_input_min_limit, mv_input_max_limit


def get_top_mv_diff_indices(
        n: int,
        mv_diff_data: np.ndarray,
        tags_to_index_mv: Dict[str, int]):

    for i in range(mv_diff_data.shape[1]):
        mv_diff_data[:, i] = np.absolute(mv_diff_data[:, i])
    mv_diff_data = MinMaxScaler().fit_transform(mv_diff_data)
    mv_diff_data = mv_diff_data.mean(axis=1)
    greatest_mv_diff_indices = np.argsort(
        mv_diff_data)[-n:]

    return greatest_mv_diff_indices
