from sklearn.neighbors import LocalOutlierFactor
from sklearn.linear_model import Lasso
import xgboost as xgb
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import TweedieRegressor
from sklearn.model_selection import train_test_split
from typing import Dict, Set, Union, Optional
from tensorflow.math import lgamma, reduce_logsumexp
from keras import backend as K
from typing import Dict, Union, Optional, List
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import MinMaxScaler, StandardScaler, RobustScaler, QuantileTransformer
from sklearn.mixture import GaussianMixture, BayesianGaussianMixture
import numpy as np
from tensorflow.keras.optimizers import Adam, RMSprop, Nadam, Adadelta, SGD, Adamax, Ftrl
from keras.models import Model

from keras.losses import mae, binary_crossentropy, mse, poisson, LogCosh, Huber, cosine_similarity
from keras.layers import Input, Convolution2D, Dense, concatenate, multiply, Flatten, LSTM, TimeDistributed, Reshape, \
    RepeatVector, Permute, Dropout, Embedding, Reshape, Lambda, Subtract, Add, BatchNormalization, LeakyReLU, Dot

from keras.activations import selu

from keras.initializers import RandomNormal

from keras.regularizers import l2, l1

from sklearn.ensemble import IsolationForest

from sklearn.pipeline import Pipeline

from keras.callbacks import EarlyStopping

from .bench_inputs import MINUTE_INPUT_KIND, DAY_INPUT_KIND, SENSOR_INPUT_KIND,\
    BlankTransformer, MinutesToHour, DayToPeriod


from random import seed, randint

import sys
sys.path.append("..")

OPTIMIZERS = {
    "nadam": Nadam,
    "adam": Adam,
    "adamax": Adamax,
    "rmsprop": RMSprop,
    "adadelta": Adadelta,
    "ftrl": Ftrl,
    "sgd": SGD
}

EPSILON = 1e-4
NEAR_ZERO_TOLERANCE = 0.1
SEED = 12

# It corresponds to 2 * sigma
QUANTILE_ALPHA = 0.02275


def draw_suggestions(
        input: np.ndarray,
        median_estimators: Dict,
        lower_estimators: Dict,
        output_variables: List,
        n_suggestions: int = 1,
        split_means: bool = True):
    """
    Draws suggestions based on estimated statistics.

    Suggestions are generated based on normal distribution and confidence intervals (with estimated mean,
    std. deviation, upper and lower bounds.)

    Args
    ----
    input : np.ndarray
        The input to the generative models which constitutes of MV and CV history.
    upper_estimators : dict
        Upper bound estimators for the MVs based on log-cosh objective.
    lower_estimators : dict
        Lower bound estimators for the MVs based on log-cosh objective.
    output_variables : list
        List containing strings of target MVs.
    n_suggestions : int
        Number of suggestions to produce (draw) based on estimated distribution.
    split_means : bool
        Whether or not to simply return the mean of the suggestions and not the suggestions themselves.
    """

    if not split_means:
        final_results = np.empty(
            (input.shape[0], len(output_variables), n_suggestions))
        for i, output_variable in enumerate(output_variables):
            medians = median_estimators[output_variable].predict(input)
            lower_quantiles = lower_estimators[output_variable].predict(input)
            stds = (np.abs(medians - lower_quantiles)) * 0.5

            for j in range(input.shape[0]):
                # We assume that the distribution is symmetric
                final_results[j, i, :] = np.random.normal(
                    medians[j], stds[j], n_suggestions)
    else:
        final_results = np.empty((input.shape[0], len(output_variables), 1))
        for i, output_variable in enumerate(output_variables):
            medians = median_estimators[output_variable].predict(input)
            lower_quantiles = lower_estimators[output_variable].predict(input)
            stds = (np.abs(medians - lower_quantiles)) * 0.5

            for j in range(input.shape[0]):
                # We assume that the distribution is symmetric
                final_results[j, i, :] = np.mean(
                    np.random.normal(medians[j], stds[j], n_suggestions))
    return final_results


def log_cosh_median(y_true, y_pred):
    """
    Log-cosh loss for median implementation

    Args
    ----
    y_true: np.array
        Array with the true values
    y_pred: np.array
        Array with predicted values

    Returns
    -------
    grad: np.array
        Gradients
    hess:
        Hessian matrix
    """
    err = y_pred - y_true
    grad = np.tanh(err)
    hess = 1 - (grad * grad)

    return grad, hess


def log_cosh_lower_quantile(y_true, y_pred):
    """
    Log-cosh loss for lower quantile implementation

    Args
    ----
    y_true: np.array
        Array with the true values
    y_pred: np.array
        Array with predicted values

    Returns
    -------
    grad: np.array
        Gradients
    hess:
        Hessian matrix
    """
    err = y_pred - y_true
    err = np.where(err < 0, QUANTILE_ALPHA * err, (1 - QUANTILE_ALPHA) * err)
    grad = np.tanh(err)
    hess = 1 - (grad * grad)

    return grad, hess


def tweedie_loss_func(p):
    def tweedie_loglikelihood(y_true, y_pred):
        loss = - y_true * K.pow(y_pred, 1 - p) / (1 - p) + \
            K.pow(y_pred, 2 - p) / (2 - p)

        # loss = 2 * (K.pow(y_true, 2 - p) / ((1 - p + EPSILON) * (2 - p)) -
        #             y_true * K.pow(y_pred, 1 - p)/(1 - p + EPSILON) +
        #             K.pow(y_pred, 2 - p)/(2 - p + EPSILON))

        return K.mean(loss)

    return tweedie_loglikelihood


def tweedie_loglikelihood_mixture(y_true, y_pred):
    k = y_pred[:, :, :, 0]
    p = y_pred[:, :, :, 1]
    alpha = y_pred[:, :, :, 2]

    y_true = K.maximum(K.minimum(y_true, K.constant(1) -
                                 EPSILON), K.constant(0) + EPSILON)
    # y_true = K.maximum(y_true, K.constant(0) + EPSILON)

    k = K.maximum(K.minimum(k, K.constant(1) - EPSILON),
                  K.constant(0) + EPSILON)
    # k = K.maximum(k, K.constant(0) + EPSILON)

    p = K.maximum(K.minimum(p, K.constant(1) - EPSILON),
                  K.constant(0) + EPSILON) + K.constant(1.5)
    # p = K.maximum(p, K.constant(0) + EPSILON) + K.constant(1.5)

    alpha = K.maximum(alpha, K.constant(0) + EPSILON)

    log_likelihood = - K.pow(y_true, 2 - p) / ((1 - p) * (2 - p)) + \
        y_true * K.pow(k, 1 - p)/(1 - p) - \
        K.pow(k, 2 - p)/(2 - p)

    # log_likelihood = y_true * K.pow(k, 1 - p) / (1 - p) - \
    #     K.pow(k, 2 - p) / (2 - p)

    loss = - reduce_logsumexp(K.log(alpha) + log_likelihood, axis=2)
    loss_std = K.std(loss, axis=1, keepdims=True)
    loss = loss / loss_std

    return K.mean(loss)


def tweedie_loglikelihood(y_true, y_pred):
    k = y_pred[:, :, 0]
    p = y_pred[:, :, 1]

    y_true = K.maximum(K.minimum(y_true, K.constant(1) -
                                 EPSILON), K.constant(0) + EPSILON)
    # y_true = K.maximum(y_true, K.constant(0) + EPSILON)

    k = K.maximum(K.minimum(k, K.constant(1) - EPSILON),
                  K.constant(0) + EPSILON)
    # k = K.maximum(k, K.constant(0) + EPSILON)

    p = K.maximum(K.minimum(p, K.constant(1) - EPSILON),
                  K.constant(0) + EPSILON) + K.constant(1.5)
    # p = K.maximum(p, K.constant(0) + EPSILON) + K.constant(1.5)

    log_likelihood = - K.pow(y_true, 2 - p) / ((1 - p) * (2 - p)) + \
        y_true * K.pow(k, 1 - p)/(1 - p) - \
        K.pow(k, 2 - p)/(2 - p)

    # log_likelihood = y_true * K.pow(k, 1 - p) / (1 - p) - \
    #     K.pow(k, 2 - p) / (2 - p)

    # loss_std = K.std(log_likelihood, axis=1, keepdims=True)
    # log_likelihood = log_likelihood / loss_std

    return K.mean(log_likelihood)


def gamma_loss_func(p):
    def gamma_loglikelihood(y_true, y_pred):
        y_pred = K.minimum(y_pred, K.constant(9)) + EPSILON
        y_true = y_true + EPSILON
        loss = - ((y_pred - 1) * K.log(y_true) - (y_true / p) -
                  y_pred * K.log(p) - lgamma(y_pred))
        return K.mean(loss)

    return gamma_loglikelihood


def inv_gauss_loglikelihood(y_true, y_pred):
    k = y_pred[:, :, :, 0]
    p = y_pred[:, :, :, 1]
    alpha = y_pred[:, :, :, 2]

    y_true = K.maximum(K.minimum(y_true, K.constant(1) -
                                 EPSILON), K.constant(0) + EPSILON)

    k = K.maximum(K.minimum(k, K.constant(1) - EPSILON),
                  K.constant(0) + EPSILON)

    # p = K.maximum(K.minimum(p, K.constant(4) - EPSILON),
    #               K.constant(0) + EPSILON)
    p = K.maximum(p, K.constant(0) + EPSILON)

    alpha = K.maximum(alpha, K.constant(0) + EPSILON)

    log_likelihood = (0.5 * K.log(p) - 1.5 * K.log(y_true) -
                      (p * (y_true - k) * (y_true - k)) / (2 * k * k * y_true))

    loss = - reduce_logsumexp(K.log(alpha) + log_likelihood, axis=2)

    loss_std = K.std(loss, axis=1, keepdims=True)
    loss = loss / loss_std

    return K.mean(loss)


def gamma_loglikelihood(y_true, y_pred):
    k = y_pred[:, :, :, 0]
    p = y_pred[:, :, :, 1]
    alpha = y_pred[:, :, :, 2]

    y_true = K.maximum(K.minimum(y_true, K.constant(1) -
                                 EPSILON), K.constant(0) + EPSILON)

    k = K.maximum(K.minimum(k, K.constant(1) - EPSILON),
                  K.constant(0) + EPSILON)

    p = K.maximum(p, K.constant(0) + EPSILON)

    alpha = K.maximum(alpha, K.constant(0) + EPSILON)

    log_likelihood = ((k - 1) * K.log(y_true) -
                      (y_true / p) - k * K.log(p) - lgamma(k))

    loss = - reduce_logsumexp(K.log(alpha) + log_likelihood, axis=2)

    return K.mean(loss)


# reparameterization trick
# instead of sampling from Q(z|X), sample epsilon = N(0,I)
# z = z_mean + sqrt(var) * epsilon
def sampling_2(args):
    """Reparameterization trick by sampling from an isotropic unit Gaussian.
    # Arguments
        args (tensor): mean and log of variance of Q(z|X)
    # Returns
        z (tensor): sampled latent vector
    """

    z_mean, z_log_var = args
    batch = K.shape(z_mean)[0]
    dim_1 = K.int_shape(z_mean)[1]
    dim_2 = K.int_shape(z_mean)[2]
    # dim_3 = K.int_shape(z_mean)[3]

    # by default, random_normal has mean = 0 and std = 1.0
    # epsilon = K.random_normal(shape=(batch, dim_1, dim_2, dim_3))
    epsilon = K.random_normal(shape=(batch, dim_1, dim_2))
    return z_mean + K.exp(0.5 * z_log_var) * epsilon


def sampling_1(args):
    """Reparameterization trick by sampling from an isotropic unit Gaussian.
    # Arguments
        args (tensor): mean and log of variance of Q(z|X)
    # Returns
        z (tensor): sampled latent vector
    """

    z_mean, z_log_var = args
    batch = K.shape(z_mean)[0]
    dim_1 = K.int_shape(z_mean)[1]

    # by default, random_normal has mean = 0 and std = 1.0
    epsilon = K.random_normal(shape=(batch, dim_1, ))
    return z_mean + K.exp(0.5 * z_log_var) * epsilon


def add_layer_with_tensor(args):
    layer, tensor = args
    batch_size = K.shape(layer)[0]
    tensor = K.reshape(tensor, (1, ) + tensor.shape)
    new_shape = [1] * len(K.int_shape(tensor))
    new_shape[0] = batch_size
    new_shape = tuple(new_shape)
    tensor = K.tile(tensor, new_shape)
    K.print_tensor(tensor[0, :, :])
    K.print_tensor(tensor[1, :, :])
    return layer + tensor


def multiply_layer_with_tensor(args):
    layer, tensor = args
    batch_size = K.shape(layer)[0]
    tensor = K.reshape(tensor, (1, ) + tensor.shape)
    new_shape = [1] * len(K.int_shape(tensor))
    new_shape[0] = batch_size
    new_shape = tuple(new_shape)
    tensor = K.tile(tensor, new_shape)
    K.print_tensor(tensor[0, :, :])
    K.print_tensor(tensor[1, :, :])
    return layer * tensor


def single_sampling(args):
    """Reparameterization trick by sampling from an isotropic unit Gaussian.
    # Arguments
        args (tensor): mean and log of variance of Q(z|X)
    # Returns
        z (tensor): sampled latent vector
    """

    z_mean, z_log_var = args
    dim = K.int_shape(z_mean)[0]
    # by default, random_normal has mean = 0 and std = 1.0
    epsilon = K.random_normal(shape=(1, dim))
    return z_mean + K.exp(0.5 * z_log_var) * epsilon


def log_var_within_one(x):
    x = K.sigmoid(x) * K.constant(0.5)
    x = K.maximum(K.minimum(x, K.constant(1) - EPSILON), K.constant(0) + 0.1)
    x = K.log(x)
    return x


def mean_correction_within_one(x):
    x = K.tanh(x) * K.constant(0.5)
    return x


def gelu(x):
    return 0.5 * x * (1 + K.tanh(x * 0.7978845608 * (1 + 0.044715 * x * x)))


def cap_gauss_activation(x):
    """
    Keeps the last layer in the range between [-4 * sigma, +4 * sigma].
    It is meant to be used when the labels are standardized.
    """
    return K.maximum(K.minimum(x, K.constant(3)), K.constant(-3))
    # return K.tanh(x) * K.constant(4)


def cap_within_one_activation(x):
    """
    Keeps the last layer in the range between [0, 1].
    It is meant to be used when the labels are standardized.
    """
    return K.maximum(K.minimum(x, K.constant(1)), K.constant(0))


def cap_efficiency(x):
    # return K.maximum(K.minimum(x, K.constant(100)), K.constant(60))
    return K.tanh(x) * 100


class CapExtremeValues(BaseEstimator, TransformerMixin):

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


class NaiveGenerative(BaseEstimator):
    """Wrapper for naive mapper which predicts the mean for the particular minute."""

    def __init__(self, **estimator_params):
        self.estimator_params = dict()
        minute_wise = estimator_params['minute_wise']
        y_shape = (len(estimator_params["output_variables"]), )
        self.estimator_params['minute_wise'] = \
            minute_wise if minute_wise is not None else False
        self.estimator_params["tags_to_index"] = estimator_params[
            "tags_to_index_mv"] if estimator_params["generate_mv"] else estimator_params["tags_to_index"]
        self.estimator_params["output_variables"] = estimator_params["output_variables"]
        self.estimator_params["generate_mv"] = estimator_params["generate_mv"]

        self.means: Union[np.ndarray, Dict[int, np.ndarray]
                          ] = dict() if minute_wise else np.zeros(y_shape)

    def set_params(self, **params):
        for para_key, para_value in params.items():
            self.estimator_params[para_key] = para_value
        return

    def get_params(self, **params):
        return self.estimator_params

    def fit(self, X: Dict[str, np.ndarray], y: np.ndarray):
        output_variables = self.estimator_params["output_variables"]
        if self.estimator_params['minute_wise']:
            tags_to_index = self.estimator_params["tags_to_index"]

            minutes = X[MINUTE_INPUT_KIND]
            means_count: Dict[int, np.ndarray] = dict()
            for i in range(y.shape[0]):
                minute = minutes[i, 0]
                if minute in self.means:
                    for j, tag_name in enumerate(output_variables):
                        self.means[minute][j] += y[i,
                                                   tags_to_index[tag_name]]
                        means_count[minute][j] += 1
                else:
                    means_count[minute] = np.ones((len(output_variables), ))
                    self.means[minute] = np.empty((len(output_variables), ))
                    for j, tag_name in enumerate(output_variables):
                        self.means[minute][j] = y[i, tags_to_index[tag_name]]

            total_mean = np.zeros((len(output_variables), ))
            total_count = np.zeros((len(output_variables), ))
            for minute in self.means.keys():
                total_mean += self.means[minute]
                total_count += means_count[minute]

            total_mean /= total_count

            for minute in self.means.keys():
                for i in range(len(output_variables)):
                    count = means_count[minute][i]
                    if count == 0:
                        self.means[minute][i] = total_mean[i]
                    else:
                        self.means[minute][i] /= count
        else:
            all_means = np.mean(y, axis=0)
            tags_to_index = self.estimator_params["tags_to_index"]
            for i, cv_name in enumerate(output_variables):
                self.means[i] = all_means[tags_to_index[cv_name]]

    def fit_predict(self, X: Dict[str, np.ndarray], y):
        self.fit(X, y)
        return self.predict(X)

    def predict(self, X: Dict[str, np.ndarray]):
        minutes = X[MINUTE_INPUT_KIND]

        if self.estimator_params['minute_wise']:
            y = np.empty((minutes.shape[0], ) + self.means[0].shape)

            for i in range(y.shape[0]):
                y[i] = self.means[minutes[i, 0]]

            return y

        return np.full((minutes.shape[0], ) + self.means.shape, self.means)


class NNGenerativeCV(BaseEstimator):

    def __init__(self, **estimator_params):
        self.estimator_params = estimator_params

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

        if "do_filtering" not in estimator_params:
            self.estimator_params["do_filtering"] = False
        else:
            self.estimator_params["do_filtering"] = estimator_params["do_filtering"]

        if "n_mixtures" not in estimator_params:
            self.estimator_params["n_mixtures"] = 1
        else:
            self.estimator_params["n_mixtures"] = estimator_params["n_mixtures"]

        if "augment_factor" not in estimator_params:
            self.estimator_params["augment_factor"] = 1
        else:
            self.estimator_params["augment_factor"] = estimator_params["augment_factor"]

        if "efficiency_augment_threshold" not in estimator_params:
            self.estimator_params["efficiency_augment_threshold"] = 100
        else:
            self.estimator_params["efficiency_augment_threshold"] = estimator_params["efficiency_augment_threshold"]

        self.estimator_params["generate_mv"] = estimator_params["generate_mv"]

        self.estimator_params["history_length_mv"] = estimator_params["history_length_mv"]

    def design_model(self,
                     input_length,
                     cv_output_length,
                     drop_out_rate,
                     n_mixtures,
                     mixture_means,
                     mixture_weights,
                     reg_penalty,
                     h_dim,
                     l_dim):

        # Prepare input.
        sensor_input = Input(shape=(input_length, ))
        sensor_layer = Dense(h_dim, activation='relu')(sensor_input)
        sensor_layer = Reshape((1, h_dim))(sensor_layer)

        # Prepare minute input.
        minute_input = Input(shape=(1, 1))
        minute_layer = Reshape((input_length, h_dim))(
            Embedding(24, h_dim * input_length)(minute_input))

        day_input = Input(shape=(1, 1))
        day_layer = Reshape((input_length, h_dim))(
            Embedding(7, h_dim * input_length)(day_input))

        # build encoder model
        x = concatenate([sensor_layer, minute_layer, day_layer], axis=1)
        x = Flatten()(x)
        x = Dense(h_dim * cv_output_length, activation='relu')(x)
        x = BatchNormalization()(x)
        x = Reshape((cv_output_length, h_dim))(x)

        z_mean = Dense(n_mixtures, activation=mean_correction_within_one,
                       kernel_initializer='glorot_normal', name='z_mean')(x)
        # z_mean = BatchNormalization()(z_mean)
        # z_mean = Reshape((cv_output_length,))(z_mean)

        z_log_var = Dense(n_mixtures, activation=log_var_within_one,
                          kernel_initializer='glorot_normal', name='z_log_var')(x)
        z_log_var = BatchNormalization()(z_log_var)
        # z_log_var = Reshape((cv_output_length,))(z_log_var)

        alpha = Dense(n_mixtures, activation="softmax", name='alpha')(x)

        encoder = Model([sensor_input, minute_input, day_input], [
                        z_mean, z_log_var, alpha], name='encoder')

        # build z decoder model
        z_mean_input = Input(shape=(cv_output_length, n_mixtures))
        z_log_var_input = Input(shape=(cv_output_length, n_mixtures))
        alpha_input = Input(shape=(cv_output_length, n_mixtures))

        # use reparameterization trick to push the sampling out as input
        # note that "output_shape" isn't necessary with the TensorFlow backend
        z = Lambda(sampling_2, output_shape=(cv_output_length, n_mixtures), name='z')(
            [z_mean_input, z_log_var_input])

        z_decoder = Model([z_mean_input, z_log_var_input, alpha_input], [
                          z, z_log_var_input, alpha_input], name='z_decoder')

        # build decoder model
        z_input = Input(shape=(cv_output_length, n_mixtures))
        # z = RepeatVector(n_mixtures)(z_input)
        # z = Permute((2, 1))(z)

        z_log_var_input = Input(shape=(cv_output_length, n_mixtures))

        mixture_weights_tensor = K.constant(mixture_weights)
        mixture_weights_tensor = K.expand_dims(mixture_weights_tensor)
        alpha_input = Input(shape=(cv_output_length, n_mixtures))
        alpha = Reshape((cv_output_length, n_mixtures, 1))(alpha_input)
        alpha = Lambda(multiply_layer_with_tensor)(
            [alpha, mixture_weights_tensor])

        # x = Reshape((cv_output_length, n_mixtures, 1))(z)
        # x = Dense(h_dim, activation='relu')(x)
        # x = BatchNormalization()(x)

        p = Reshape((cv_output_length, n_mixtures, 1))(z_log_var_input)
        p = Dense(1, activation="sigmoid")(p)
        p = BatchNormalization()(p)

        k = Reshape((cv_output_length, n_mixtures, 1))(z_input)
        mixture_means_tensor = K.constant(mixture_means)
        mixture_means_tensor = K.expand_dims(mixture_means_tensor)
        k = Lambda(add_layer_with_tensor)([k, mixture_means_tensor])
        # k = Lambda(cap_within_one_activation)(k)

        decoder = Model([z_input, z_log_var_input, alpha_input], [
                        k, p, alpha], name='decoder')

        [k, p, alpha] = decoder(
            z_decoder(encoder([sensor_input, minute_input, day_input])))

        output_a = Dot((2, 2))([k, alpha])
        output_b = concatenate([k, p, alpha], axis=3)

        model = Model([sensor_input, minute_input, day_input],
                      [output_a, output_b], name='whole_model')

        kl_loss = 1 + z_log_var - K.square(z_mean) - K.exp(z_log_var)
        kl_loss = K.sum(kl_loss, axis=-1)
        kl_loss *= -0.5
        kl_loss /= cv_output_length
        kl_loss = K.mean(kl_loss)

        model.add_loss(kl_loss)

        return encoder, decoder, model

    def __initialize_model(self, X, y):
        cv_input_variables = self.estimator_params["cv_input_variables"]
        mv_input_variables = self.estimator_params["mv_input_variables"]
        output_variables = self.estimator_params["output_variables"]

        # Here we define the model:
        drop_out_rate = self.estimator_params["drop_out_rate"]
        reg_penalty = self.estimator_params["reg_penalty"]
        h_dim = self.estimator_params["h_dim"]
        l_dim = self.estimator_params["latent_dim"]
        n_mixtures = self.estimator_params["n_mixtures"]

        mixture_means = np.empty((len(output_variables), n_mixtures))
        mixture_weights = np.ones((len(output_variables), n_mixtures))
        for i, clusterer_id in enumerate(self.clusterers.keys()):
            gmm = self.clusterers[clusterer_id]
            means = gmm.means_
            mixture_counts = np.zeros((n_mixtures, ))
            means_classification = gmm.predict(means)

            for j, c in enumerate(means_classification):
                means[j, :] = means[c, :]
                mixture_counts[c] += 1

            for j, c in enumerate(means_classification):
                mixture_weights[i, j] /= mixture_counts[c]

            mixture_means[i, :] = means[:, 0]

        encoder, decoder, model = \
            self.design_model(input_length=len(cv_input_variables) + len(mv_input_variables),
                              cv_output_length=len(output_variables),
                              drop_out_rate=drop_out_rate,
                              reg_penalty=reg_penalty,
                              h_dim=h_dim,
                              l_dim=l_dim,
                              n_mixtures=n_mixtures,
                              mixture_means=mixture_means,
                              mixture_weights=mixture_weights)

        self.encoder = encoder
        self.decoder = decoder
        self.model = model

        if(self.estimator_params["verbose"] == 2):
            print(f"{self.model.summary()}")

    def __fit(self, input: List[np.ndarray], labels: List[np.ndarray]):
        callback = EarlyStopping(
            monitor='val_loss',
            verbose=self.estimator_params["verbose"],
            min_delta=0,
            patience=4,
            mode='auto')

        optimizer = OPTIMIZERS[self.estimator_params["optimizer"]]

        log_cosh = LogCosh(reduction="auto", name="log_cosh")

        # Here we fit the model:
        self.model.compile(
            optimizer(lr=self.estimator_params["learning_rate"]),
            loss=[mae, tweedie_loglikelihood_mixture],
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

    def fit_predict(self, X, y):
        n_mixtures = self.estimator_params["n_mixtures"]

        (sensor_input, minute_input, day_input, labels, outlier_filter) = \
            _extract_input_and_cv_labels(
                self.estimator_params, self.transformer, X, y)

        clusterers = _train_clutsers(
            clusters_n=n_mixtures,
            output_variables=self.estimator_params["output_variables"],
            output_var_x=labels)

        self.clusterers = clusterers

        self.__initialize_model(X, y)

        if outlier_filter is not None:
            f_sensor_input = sensor_input[outlier_filter]
            f_minute_input = minute_input[outlier_filter]
            f_day_input = day_input[outlier_filter]
            labels = labels[outlier_filter]

            input = [f_sensor_input, f_minute_input, f_day_input]
        else:
            input = [sensor_input, minute_input, day_input]

        labels = np.repeat(labels[:, :, np.newaxis], n_mixtures, axis=2)
        # Here we fit the model:
        self.__fit(input, [labels, labels])

        input = [sensor_input, minute_input, day_input]

        results = self.decoder.predict(self.encoder.predict(input))
        results = np.squeeze(np.sum(results[0] * results[2], axis=2))
        results = self.transformer.inverse_transform(results)

        return results

    def fit(self, X, y):
        n_mixtures = self.estimator_params["n_mixtures"]

        (sensor_input, minute_input, day_input, labels, outlier_filter) = \
            _extract_input_and_cv_labels(
                self.estimator_params, self.transformer, X, y)

        clusterers = _train_clutsers(
            clusters_n=n_mixtures,
            output_variables=self.estimator_params["output_variables"],
            output_var_x=labels)

        self.clusterers = clusterers

        self.__initialize_model(X, y)

        if outlier_filter is not None:
            sensor_input = sensor_input[outlier_filter]
            minute_input = minute_input[outlier_filter]
            day_input = day_input[outlier_filter]
            labels = labels[outlier_filter]

        input = [sensor_input, minute_input, day_input]
        labels = np.repeat(labels[:, :, np.newaxis], n_mixtures, axis=2)
        self.__fit(input, [labels, labels])

        return self

    def predict(self, X):

        (sensor_input, minute_input, day_input, labels, outlier_filter) = \
            _extract_input_and_cv_labels(
                self.estimator_params, self.transformer, X)

        input = [sensor_input, minute_input, day_input]

        results = self.decoder.predict(self.encoder.predict(input))
        results = np.squeeze(np.sum(results[0] * results[2], axis=2))
        results = self.transformer.inverse_transform(results)

        return results

    def get_params(self):
        return self.model.get_config()


class NNGenerativeMV(BaseEstimator):

    def __init__(self, **estimator_params):
        self.estimator_params = estimator_params

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

        if "do_filtering" not in estimator_params:
            self.estimator_params["do_filtering"] = False
        else:
            self.estimator_params["do_filtering"] = estimator_params["do_filtering"]

        self.estimator_params["generate_mv"] = estimator_params["generate_mv"]

        self.estimator_params["mv_history_length"] = estimator_params["mv_history_length"]

        if "base_model" not in estimator_params:
            self.estimator_params["base_model"] = True

        if "min_efficiency_threshold" not in estimator_params:
            self.estimator_params["min_efficiency_threshold"] = 0

        if "min_diff_efficiency_threshold" not in estimator_params:
            self.estimator_params["min_diff_efficiency_threshold"] = -100

        if "mv_abs_diff_threshold" not in estimator_params:
            self.estimator_params["mv_abs_diff_threshold"] = 0

    def design_base_model(self,
                          cv_input_length,
                          output_length,
                          drop_out_rate,
                          reg_penalty,
                          h_dim,
                          l_dim):

        # Prepare CV input.
        cv_sensor_input = Input(shape=(cv_input_length, ))
        cv_sensor_layer = Dense(h_dim, activation='relu')(cv_sensor_input)
        cv_sensor_layer = Reshape((1, h_dim))(cv_sensor_layer)

        cv_diff_sensor_input = Input(shape=(cv_input_length, ))
        cv_diff_sensor_layer = Dense(
            h_dim, activation='relu')(cv_diff_sensor_input)
        cv_diff_sensor_layer = Reshape((1, h_dim))(cv_diff_sensor_layer)

        # Prepare minute input.
        minute_input = Input(shape=(1, 1))
        minute_layer = Reshape((cv_input_length, h_dim))(
            Embedding(24, h_dim * cv_input_length)(minute_input))

        day_input = Input(shape=(1, 1))
        day_layer = Reshape((cv_input_length, h_dim))(
            Embedding(7, h_dim * cv_input_length)(day_input))

        # build encoder model
        x = concatenate([cv_sensor_layer, cv_diff_sensor_layer,
                         minute_layer, day_layer], axis=1)
        x = Flatten()(x)
        x = Dense(h_dim, activation='relu')(x)
        x = BatchNormalization()(x)

        z_mean = Dense(l_dim,
                       kernel_initializer='glorot_normal', name='z_mean')(x)

        z_log_var = Dense(
            l_dim, kernel_initializer='glorot_normal', name='z_log_var')(x)

        encoder = Model([cv_sensor_input, cv_diff_sensor_input, minute_input, day_input], [
                        z_mean, z_log_var], name='encoder')

        # build z decoder model
        z_mean_input = Input(shape=(l_dim,))
        z_log_var_input = Input(shape=(l_dim,))

        # use reparameterization trick to push the sampling out as input
        # note that "output_shape" isn't necessary with the TensorFlow backend
        z = Lambda(sampling_1, output_shape=(l_dim, ),
                   name='z')([z_mean_input, z_log_var_input])

        z_decoder = Model([z_mean_input, z_log_var_input], [
                          z, z_log_var_input], name='z_decoder')

        # build decoder model
        z_input = Input(shape=(l_dim, ))

        z_log_var_input = Input(shape=(l_dim, ))

        p = Dense(output_length, activation="relu")(z_input)
        p = Reshape((output_length, 1))(p)

        k = Dense(output_length, activation="relu")(z_input)
        k = Reshape((output_length, 1))(k)

        decoder = Model([z_input, z_log_var_input], [k, p], name='decoder')

        [k, p] = decoder(
            z_decoder(encoder([cv_sensor_input, cv_diff_sensor_input, minute_input, day_input])))

        output_a = k
        output_b = concatenate([k, p], axis=2)

        model = Model([cv_sensor_input, cv_diff_sensor_input, minute_input, day_input],
                      [output_a, output_b], name='whole_model')

        kl_loss = 1 + z_log_var - K.square(z_mean) - K.exp(z_log_var)
        kl_loss = K.sum(kl_loss, axis=-1)
        kl_loss *= -0.5
        kl_loss /= output_length
        kl_loss = K.mean(kl_loss)

        model.add_loss(kl_loss)

        return encoder, decoder, model

    def design_model(self,
                     cv_input_length,
                     mv_input_length,
                     mv_history_length,
                     output_length,
                     drop_out_rate,
                     reg_penalty,
                     h_dim,
                     l_dim):

        # Prepare CV input.
        cv_sensor_input = Input(shape=(cv_input_length, ))
        cv_sensor_layer = Dense(h_dim, activation='relu')(cv_sensor_input)
        cv_sensor_layer = Reshape((1, h_dim))(cv_sensor_layer)

        cv_diff_sensor_input = Input(shape=(cv_input_length, ))
        cv_diff_sensor_layer = Dense(
            h_dim, activation='relu')(cv_diff_sensor_input)
        cv_diff_sensor_layer = Reshape((1, h_dim))(cv_diff_sensor_layer)

        # Prepare MV input.
        mv_sensor_input = Input(shape=(mv_input_length, mv_history_length, 1))
        mv_sensor_layer = Permute((2, 1, 3))(mv_sensor_input)
        mv_sensor_layer = Convolution2D(
            filters=h_dim,
            kernel_size=(5, mv_input_length),
            strides=(5, mv_input_length),
            activation="relu",
            data_format="channels_last",
            kernel_regularizer=l2(reg_penalty),
            bias_regularizer=l2(reg_penalty))(mv_sensor_layer)

        mv_sensor_layer = TimeDistributed(Flatten())(mv_sensor_layer)

        mv_diff_sensor_input = Input(
            shape=(mv_input_length, mv_history_length, 1))
        mv_diff_sensor_layer = Permute((2, 1, 3))(mv_diff_sensor_input)
        mv_diff_sensor_layer = Convolution2D(
            filters=h_dim,
            kernel_size=(5, mv_input_length),
            strides=(5, mv_input_length),
            activation="relu",
            data_format="channels_last",
            kernel_regularizer=l2(reg_penalty),
            bias_regularizer=l2(reg_penalty))(mv_diff_sensor_layer)

        mv_diff_sensor_layer = TimeDistributed(Flatten())(mv_diff_sensor_layer)

        # Prepare minute input.
        minute_input = Input(shape=(1, 1))
        minute_layer = Reshape((cv_input_length, h_dim))(
            Embedding(24, h_dim * cv_input_length)(minute_input))

        day_input = Input(shape=(1, 1))
        day_layer = Reshape((cv_input_length, h_dim))(
            Embedding(7, h_dim * cv_input_length)(day_input))

        # build encoder model
        x = concatenate([cv_sensor_layer, cv_diff_sensor_layer, mv_sensor_layer, mv_diff_sensor_layer,
                         minute_layer, day_layer], axis=1)
        x = Flatten()(x)
        x = Dense(h_dim, activation='relu')(x)
        x = BatchNormalization()(x)

        z_mean = Dense(
            l_dim, kernel_initializer='glorot_normal', name='z_mean')(x)

        z_log_var = Dense(
            l_dim, kernel_initializer='glorot_normal', name='z_log_var')(x)

        encoder = Model([cv_sensor_input, cv_diff_sensor_input, mv_sensor_input,
                         mv_diff_sensor_input, minute_input, day_input],
                        [z_mean, z_log_var],
                        name='encoder')

        # build z decoder model
        z_mean_input = Input(shape=(l_dim,))
        z_log_var_input = Input(shape=(l_dim,))

        # use reparameterization trick to push the sampling out as input
        # note that "output_shape" isn't necessary with the TensorFlow backend
        z = Lambda(sampling_1, output_shape=(l_dim, ),
                   name='z')([z_mean_input, z_log_var_input])

        z_decoder = Model([z_mean_input, z_log_var_input], [
                          z, z_log_var_input], name='z_decoder')

        # build decoder model
        z_input = Input(shape=(l_dim, ))

        z_log_var_input = Input(shape=(l_dim, ))

        p = Dense(h_dim, activation="relu")(z_input)
        p = Dense(output_length, activation="sigmoid")(p)
        p = BatchNormalization()(p)
        p = Reshape((output_length, 1))(p)

        k = Dense(h_dim, activation="relu")(z_input)
        k = BatchNormalization()(k)
        k = Dense(output_length, activation="sigmoid")(k)
        k = Reshape((output_length, 1))(k)

        decoder = Model([z_input, z_log_var_input], [k, p], name='decoder')

        [k, p] = decoder(
            z_decoder(encoder([cv_sensor_input, cv_diff_sensor_input, mv_sensor_input,
                               mv_diff_sensor_input, minute_input, day_input])))

        output_a = k
        output_b = concatenate([k, p], axis=2)

        model = Model([cv_sensor_input, cv_diff_sensor_input, mv_sensor_input,
                       mv_diff_sensor_input, minute_input, day_input],
                      [output_a, output_b],
                      name='whole_model')

        kl_loss = 1 + z_log_var - K.square(z_mean) - K.exp(z_log_var)
        kl_loss = K.sum(kl_loss, axis=-1)
        kl_loss *= -0.5
        kl_loss /= output_length
        kl_loss = K.mean(kl_loss)

        model.add_loss(kl_loss)

        return encoder, decoder, model

    def __initialize_models(self, X, y):
        cv_input_variables = self.estimator_params["cv_input_variables"]
        mv_input_variables = self.estimator_params["mv_input_variables"]
        mv_history_length = self.estimator_params["mv_history_length"]
        output_variables = self.estimator_params["output_variables"]

        # Here we define the model:
        drop_out_rate = self.estimator_params["drop_out_rate"]
        reg_penalty = self.estimator_params["reg_penalty"]
        h_dim = self.estimator_params["h_dim"]
        l_dim = self.estimator_params["latent_dim"]

        self.encoders = dict()
        self.decoders = dict()
        self.models = dict()

        for label_tag_name in output_variables:
            encoder, decoder, model = \
                self.design_base_model(cv_input_length=len(cv_input_variables),
                                       output_length=1,
                                       drop_out_rate=drop_out_rate,
                                       reg_penalty=reg_penalty,
                                       h_dim=h_dim,
                                       l_dim=l_dim) if self.estimator_params["base_model"] else \
                self.design_model(cv_input_length=len(cv_input_variables),
                                  mv_input_length=len(mv_input_variables),
                                  mv_history_length=mv_history_length,
                                  output_length=1,
                                  drop_out_rate=drop_out_rate,
                                  reg_penalty=reg_penalty,
                                  h_dim=h_dim,
                                  l_dim=l_dim)

            self.encoders[label_tag_name] = encoder
            self.decoders[label_tag_name] = decoder
            self.models[label_tag_name] = model

        if(self.estimator_params["verbose"] == 2):
            print(f"{self.models[output_variables[0]].summary()}")

    def __fit(self, input: List[np.ndarray], labels: np.ndarray):
        callback = EarlyStopping(
            monitor='val_loss',
            verbose=self.estimator_params["verbose"],
            min_delta=0,
            patience=4,
            mode='auto')

        optimizer = OPTIMIZERS[self.estimator_params["optimizer"]]

        log_cosh = LogCosh(reduction="auto", name="log_cosh")

        for i, model in enumerate(self.models.values()):
            # Here we fit the model:
            model.compile(
                optimizer(lr=self.estimator_params["learning_rate"]),
                loss=[mse, tweedie_loglikelihood],
                loss_weights=[1, 0])
            model.fit(
                input,
                [label[:, i] for label in labels],
                epochs=self.estimator_params["epochs"],
                verbose=self.estimator_params["verbose"],
                shuffle=True,
                batch_size=self.estimator_params["batch_size"],
                validation_split=0.1,
                callbacks=[callback])

    def fit_predict(self, X, y):

        (sensor_input_cv, sensor_input_cv_diff, sensor_input_mv,
         sensor_input_mv_diff, minute_input, day_input, labels, outlier_filter) = \
            _extract_input_and_mv_labels(
                self.estimator_params, self.transformer, X, y)

        self.__initialize_models(X, y)

        if outlier_filter is not None:
            f_sensor_input_cv = sensor_input_cv[outlier_filter]
            f_sensor_input_cv_diff = sensor_input_cv_diff[outlier_filter]
            f_sensor_input_mv = sensor_input_mv[outlier_filter]
            f_sensor_input_mv_diff = sensor_input_mv_diff[outlier_filter]
            f_minute_input = minute_input[outlier_filter]
            f_day_input = day_input[outlier_filter]
            labels = labels[outlier_filter]

            input = [f_sensor_input_cv, f_sensor_input_cv_diff, f_minute_input, f_day_input] \
                if self.estimator_params["base_model"] else [f_sensor_input_cv, f_sensor_input_cv_diff,
                                                             f_sensor_input_mv, f_sensor_input_mv_diff,
                                                             f_minute_input, f_day_input]
        else:
            input = [sensor_input_cv, sensor_input_cv_diff, minute_input, day_input] \
                if self.estimator_params["base_model"] else [sensor_input_cv, sensor_input_cv_diff, sensor_input_mv,
                                                             sensor_input_mv_diff, minute_input, day_input]

        # Here we fit the model:
        self.__fit(input, [labels, labels])

        input = [sensor_input_cv, sensor_input_cv_diff, minute_input, day_input] \
            if self.estimator_params["base_model"] else [sensor_input_cv, sensor_input_cv_diff, sensor_input_mv,
                                                         sensor_input_mv_diff, minute_input, day_input]

        final_results = np.empty((input[0].shape[0], len(self.decoders)))

        for i, tag_name in enumerate(self.decoders.keys()):
            decoder = self.decoders[tag_name]
            encoder = self.encoders[tag_name]

            results = decoder.predict(encoder.predict(input))
            final_results[:, i] = np.squeeze(results[0])

        final_results = self.transformer.inverse_transform(final_results)

        return final_results

    def fit(self, X, y):

        (sensor_input_cv, sensor_input_cv_diff, sensor_input_mv, sensor_input_mv_diff,
         minute_input, day_input, labels, outlier_filter) = \
            _extract_input_and_mv_labels(
                self.estimator_params, self.transformer, X, y)

        self.__initialize_models(X, y)

        if outlier_filter is not None:
            sensor_input_cv = sensor_input_cv[outlier_filter]
            sensor_input_mv = sensor_input_mv[outlier_filter]
            minute_input = minute_input[outlier_filter]
            day_input = day_input[outlier_filter]
            labels = labels[outlier_filter]

        input = [sensor_input_cv, sensor_input_cv_diff, minute_input, day_input] \
            if self.estimator_params["base_model"] else [sensor_input_cv, sensor_input_cv_diff, sensor_input_mv,
                                                         sensor_input_mv_diff, minute_input, day_input]
        self.__fit(input, [labels, labels])

        return self

    def predict(self, X):

        (sensor_input_cv, sensor_input_cv_diff, sensor_input_mv,
         sensor_input_mv_diff, minute_input, day_input,
         labels, outlier_filter) = \
            _extract_input_and_mv_labels(
                self.estimator_params, self.transformer, X)

        input = [sensor_input_cv, sensor_input_cv_diff, minute_input, day_input] \
            if self.estimator_params["base_model"] else [sensor_input_cv, sensor_input_cv_diff, sensor_input_mv,
                                                         sensor_input_mv_diff, minute_input, day_input]

        final_results = np.empty((input[0].shape[0], len(self.decoders)))

        for i, tag_name in enumerate(self.decoders.keys()):
            decoder = self.decoders[tag_name]
            encoder = self.encoders[tag_name]

            results = decoder.predict(encoder.predict(input))
            final_results[:, i] = np.squeeze(results[0])

        final_results = self.transformer.inverse_transform(final_results)

        return final_results

    def get_params(self):
        output_variables = self.estimator_params["output_variables"]
        return self.models[output_variables[0]].get_config()


class XgbEarlyStopping(BaseEstimator):
    """Wrapper for XGBoost which extends the the estimator with
    early stopping framework.

    Attributes
    ----------
    **estimator_params : mult
        Various parameters for data manipulation and model hyperparameters

        "n_suggestions" : int
            Number of suggestions draw per MV per instance.
        "quantile_alpha" : float (between 0 and 1)
            Used as an interval parameter for log-cosh loss
        "generative_prediction" : bool
            If true, the means of all suggestions drawn per instance are used as a final suggestions.
            If false, returns all the suggestions the way they were drawn.
        "label_transformers" : list
            List of chosen label transformers, mapped with LABEL_TRANSFORMERS dict.
        "do_filtering" : bool
            Specifies whether or not to do filtering.
        "generate_mv" : bool
            Specifies whether or not to generate the MVs
        "history_length" : int
            Specifies the history length to use as input.
        "base_model" : bool
            Decides whether to use the base model or more refined one
        "min_efficiency_threshold" : int (between 0 and 100)
            Minimum threshold for the efficiency target variable if applicable.
        "min_diff_efficiency_threshold" : float
            Minimum difference between current and previous instance to include.
        "predict_diff" : bool
            Whether or deal with the differences or the nominal values.
    early_stopping_rounds : int
        Hyperparameter to stop model learning parameters based on result improvement on training data.
    val_size : int (between 0 and 10)
        Parameter for the size of the validation set.
    estimators : dict
        Dictionary which as keys holds the tags and as values has the trained mean models.
    lower_quantile_estimators : dict
        Dictionary which as keys holds the tags and as values has the trained log-cosh lower quantile models.

    """

    def __init__(self,  early_stopping_rounds=5, val_size=0.1,
                 eval_metric='mae', **estimator_params):
        self.estimator_params = estimator_params

        if "n_suggestions" not in self.estimator_params or self.estimator_params["n_suggestions"] < 1:
            self.estimator_params["n_suggestions"] = 1

        preprocessing_steps = []

        if "quantile_alpha" not in self.estimator_params:
            self.estimator_params["quantile_alpha"] = 0.05

        if "generative_prediction" not in self.estimator_params:
            self.estimator_params["generative_prediction"] = False

        if "label_transformers" in self.estimator_params and len(estimator_params["label_transformers"]) > 0:
            for transformer_name in estimator_params["label_transformers"]:
                if transformer_name in LABEL_TRANSFORMERS:
                    if transformer_name == "quantile":
                        preprocessing_steps.append(
                            (transformer_name, LABEL_TRANSFORMERS[transformer_name]()))
                    else:
                        preprocessing_steps.append(
                            (transformer_name, LABEL_TRANSFORMERS[transformer_name]()))

        if len(preprocessing_steps) == 0:
            preprocessing_steps.append(
                ("blank_transformer", BlankTransformer()))
        self.transformer = Pipeline(preprocessing_steps)

        if "do_filtering" not in estimator_params:
            self.estimator_params["do_filtering"] = False
        else:
            self.estimator_params["do_filtering"] = estimator_params["do_filtering"]

        self.estimator_params["generate_mv"] = estimator_params["generate_mv"]

        self.estimator_params["history_length"] = estimator_params["history_length"]

        if "base_model" not in estimator_params:
            self.estimator_params["base_model"] = True

        if "min_efficiency_threshold" not in estimator_params:
            self.estimator_params["min_efficiency_threshold"] = 0

        if "min_diff_efficiency_threshold" not in estimator_params:
            self.estimator_params["min_diff_efficiency_threshold"] = -100

        if "predict_diff" in estimator_params:
            self.predict_diff = estimator_params["predict_diff"]
            del estimator_params["predict_diff"]
        else:
            self.predict_diff = False
        self.early_stopping_rounds = early_stopping_rounds
        self.val_size = val_size
        self.eval_metric = eval_metric

        self.estimator_params = estimator_params

        output_variables = self.estimator_params["output_variables"]

        var_model_hyper_parameters = self.estimator_params["var_model_hyper_parameters"]

        self.estimators = dict()
        self.lower_quantile_estimators = dict()

        for label_tag_name in output_variables:
            hyper_para = dict(var_model_hyper_parameters[label_tag_name])
            del hyper_para["near_zero_tolerance"]
            del hyper_para["retain_zero_ratio"]

            hyper_para["objective"] = log_cosh_median
            self.estimators[label_tag_name] = xgb.XGBRegressor(**hyper_para)

            hyper_para["objective"] = log_cosh_lower_quantile
            self.lower_quantile_estimators[label_tag_name] = xgb.XGBRegressor(
                **hyper_para)

    def fit_predict(self, X, y):
        """
        Preparing the input, fitting the models and generating suggestions and returning the results.

        Args
        ----
        X: np.ndarray
            The input data.
        y: np.ndarray
            The labels of the MVs

        Returns
        -------
        final_results
            The generated MVs either in raw format or averaged over drawn suggestions.
        """

        output_variables = self.estimator_params["output_variables"]

        (sensor_input, sensor_input_diff, minute_input, day_input, labels, outlier_filter) = \
            _extract_input_and_mv_labels(
                self.estimator_params, self.transformer, X, y)

        sensor_input, sensor_input_diff = merger_mv_history(
            sensor_input, sensor_input_diff)

        if outlier_filter is not None:
            f_sensor_input = sensor_input[outlier_filter]
            f_sensor_input_diff = sensor_input_diff[outlier_filter]
            f_minute_input = minute_input[outlier_filter]
            f_day_input = day_input[outlier_filter]
            labels = labels[outlier_filter]

            input = [f_sensor_input, f_sensor_input_diff, f_minute_input, f_day_input] \
                if self.estimator_params["base_model"] else [f_sensor_input, f_sensor_input_diff,
                                                             f_minute_input, f_day_input]
        else:
            input = [sensor_input, sensor_input_diff, minute_input, day_input] \
                if self.estimator_params["base_model"] else [sensor_input, sensor_input_diff, minute_input, day_input]

        # aligne all of the shapes of input element
        input = prepare_input_for_xgb(input)

        # concatenate list of arrays into one arrays
        input = np.concatenate(input, axis=1)

        # Here we fit the model:
        self.__fit(input, labels)

        input = [sensor_input, sensor_input_diff, minute_input, day_input] \
            if self.estimator_params["base_model"] else [sensor_input, sensor_input_diff, minute_input, day_input]

        # aligne all of the shapes of input element
        input = prepare_input_for_xgb(input)

        # concatenate list of arrays into one arrays
        input = np.concatenate(input, axis=1)

        if self.estimator_params["generative_prediction"]:

            n_suggestions = self.estimator_params["n_suggestions"]
            final_results = draw_suggestions(
                input,
                self.estimators,
                self.lower_quantile_estimators,
                output_variables,
                n_suggestions,
                split_means=False)

        else:
            final_results = np.empty((input.shape[0], len(output_variables)))

            for i, output_variable in enumerate(output_variables):
                if self.estimators[output_variable].get_params()["booster"] == "gblinear":
                    final_results[:, i] = self.estimators[output_variable].predict(
                        input, ntree_limit=0)
                else:
                    final_results[:, i] = self.estimators[output_variable].predict(
                        input)

            final_results = self.transformer.inverse_transform(final_results)

        return final_results

    def fit(self, X, y):

        (sensor_input, sensor_input_diff, minute_input, day_input, labels, outlier_filter) = \
            _extract_input_and_mv_labels(
                self.estimator_params, self.transformer, X, y)

        # for xgboost input, convert tensor --> multiple arrays: e.g. (670,4,10) --> (670-10, 1)x4
        sensor_input, sensor_input_diff = merger_mv_history(
            sensor_input, sensor_input_diff)

        if outlier_filter is not None:
            f_sensor_input = sensor_input[outlier_filter]
            f_sensor_input_diff = sensor_input_diff[outlier_filter]
            f_minute_input = minute_input[outlier_filter]
            f_day_input = day_input[outlier_filter]
            labels = labels[outlier_filter]

            input = [f_sensor_input, f_sensor_input_diff, f_minute_input, f_day_input] \
                if self.estimator_params["base_model"] else [f_sensor_input, f_sensor_input_diff,
                                                             f_minute_input, f_day_input]
        else:
            input = [sensor_input, sensor_input_diff, minute_input, day_input] \
                if self.estimator_params["base_model"] else [sensor_input, sensor_input_diff, minute_input, day_input]
        # aligne all of the shapes of input element
        input = prepare_input_for_xgb(input)

        # concatenate list of arrays into one arrays
        input = np.concatenate(input, axis=1)

        self.__fit(input, labels)
        return self

    def __fit(self, X, y):
        """
        Splits the data into training and validation and fits the models for predicting the statistics.

        Args
        ----
        X: np.ndarray
            The input data.
        y: np.ndarray
            The labels of the MVs
        """
        output_variables = self.estimator_params["output_variables"]

        for i, output_variable in enumerate(output_variables):
            near_zero_tolerance = self.estimator_params[
                "var_model_hyper_parameters"][output_variable]["near_zero_tolerance"]
            retain_zero_ratio = self.estimator_params[
                "var_model_hyper_parameters"][output_variable]["retain_zero_ratio"]
            label_filter = filter_zero_inflation(
                y[:, i], retain_zero_ratio, near_zero_tolerance)

            x_train, x_val, y_train, y_val = train_test_split(
                X[label_filter], y[label_filter, i], test_size=self.val_size)
            self.estimators[output_variable].fit(
                X=x_train,
                y=y_train,
                early_stopping_rounds=self.early_stopping_rounds,
                eval_metric=self.eval_metric,
                eval_set=[(x_val, y_val)],
                verbose=False)

            self.lower_quantile_estimators[output_variable].fit(
                X=x_train,
                y=y_train,
                early_stopping_rounds=self.early_stopping_rounds,
                eval_metric=self.eval_metric,
                eval_set=[(x_val, y_val)],
                verbose=False)
        return

    def predict(self, X):
        """
        Preparing the input, generating suggestions and returning the results.

        Args
        ----
        X : Dict[str, np.ndarray]
            The input data.

        Returns
        -------
        final_results : np.ndarray
            The generated MVs either in raw format or averaged over drawn suggestions.
        """
        output_variables = self.estimator_params["output_variables"]

        (sensor_input, sensor_input_diff, minute_input, day_input, labels, outlier_filter) = \
            _extract_input_and_mv_labels(
                self.estimator_params, self.transformer, X)

        sensor_input, sensor_input_diff = merger_mv_history(
            sensor_input, sensor_input_diff)

        input = [sensor_input, sensor_input_diff, minute_input, day_input] \
            if self.estimator_params["base_model"] else [sensor_input, sensor_input_diff, minute_input, day_input]

        # aligne all of the shapes of input element
        input = prepare_input_for_xgb(input)

        # concatenate list of arrays into one arrays
        input = np.concatenate(input, axis=1)

        if self.estimator_params["generative_prediction"]:
            n_suggestions = self.estimator_params["n_suggestions"]
            final_results = draw_suggestions(
                input,
                self.estimators,
                self.lower_quantile_estimators,
                output_variables,
                n_suggestions,
                split_means=False)
        else:
            final_results = np.empty((input.shape[0], len(output_variables)))
            for i, output_variable in enumerate(output_variables):
                if self.estimators[output_variable].get_params()["booster"] == "gblinear":
                    final_results[:, i] = self.estimators[output_variable].predict(
                        input, ntree_limit=0)
                else:
                    final_results[:, i] = self.estimators[output_variable].predict(
                        input)

        return final_results

    def get_params(self):
        return self.estimator_params

    def set_params(self, **params):
        for estimator in self.estimators.values():
            estimator.set_params(**params)
        return


def merger_mv_history(sensor_input_mv, sensor_input_mv_diff):
    for i in range(sensor_input_mv.shape[2]):
        if i == 0:
            tmp = sensor_input_mv[:, :, i]
            tmp1 = sensor_input_mv_diff[:, :, i]
        else:
            tmp = np.concatenate((tmp, sensor_input_mv[:, :, i]), axis=1)
            tmp1 = np.concatenate(
                (tmp1, sensor_input_mv_diff[:, :, i]), axis=1)
    # my_sensor_input=(#obs, #variables, #historical_horizon)
    sensor_input_mv = tmp
    sensor_input_mv_diff = tmp1
    return sensor_input_mv, sensor_input_mv_diff


def prepare_input_for_xgb(input):
    for index, input_element in enumerate(input):
        if len(input_element.shape) < 2:
            input[index] = input_element.reshape((input_element.shape[0], 1))
    return input


def _extract_input_and_mv_labels(
        estimator_params: Dict[str, Union[str, bool, int, float, None]],
        transformer,
        X: Dict[str, np.ndarray],
        y: Optional[np.ndarray] = None):
    """
    Prepares the input and labels prior to training based on the pre-defined parameters

    Args
    ----
    estimator_params : dict
        Various parameters for data manipulation and model hyperparameters
    transformer :
        Granularity transformer object for the input data.
    X : dict
        Input data.
    y : np.ndarray
        Label data.

    Returns
    -------
    mult : tuple
        Returns the input data, labels and outlier filter
    """

    efficiency_generative = estimator_params["efficiency_generative"]
    if not efficiency_generative:
        oxygen_variables = estimator_params["additional_variables"]

    diff_lag = estimator_params["diff_lag"]
    sample_frequency = estimator_params["sample_frequency"]
    sample_frequency_reminder = 1440 % sample_frequency

    sensors = X[SENSOR_INPUT_KIND]

    minutes_x = X[MINUTE_INPUT_KIND]
    days_x = X[DAY_INPUT_KIND]
    tags_to_index = estimator_params["tags_to_index"]

    history_length = estimator_params["history_length"]
    input_variables = estimator_params["input_variables"]
    output_variables = estimator_params["output_variables"] if y is not None else [
    ]
    do_filtering = estimator_params["do_filtering"]

    if efficiency_generative:
        min_efficiency_threshold = estimator_params["min_efficiency_threshold"]
        min_diff_efficiency_threshold = estimator_params["min_diff_efficiency_threshold"]
        diff_efficiency_bucketing_type = estimator_params["diff_efficiency_bucketing_type"] if \
            "diff_efficiency_bucketing_type" in estimator_params else None
        diff_efficiency_bucket_counts_quantile_cap = estimator_params["diff_efficiency_bucket_counts_quantile_cap"] if \
            "diff_efficiency_bucket_counts_quantile_cap" in estimator_params else None
    else:
        min_excess_oxygens_threshold = estimator_params["min_excess_oxygens_threshold"] if \
            "min_excess_oxygens_threshold" in estimator_params else None
        max_excess_oxygens_threshold = estimator_params["max_excess_oxygens_threshold"] if \
            "max_excess_oxygens_threshold" in estimator_params else None

        max_rc = estimator_params["max_rc"] if \
            "max_rc" in estimator_params else None
        min_rc = estimator_params["min_rc"] if \
            "min_rc" in estimator_params else None

        max_diff_excess_oxygen_threshold = estimator_params["max_diff_excess_oxygen_threshold"] \
            if "max_diff_excess_oxygen_threshold" in estimator_params else None

    if y is not None:
        labels = np.empty((y.shape[0], len(output_variables)))
        for i, tag_name in enumerate(output_variables):
            labels[:, i] = y[:, tags_to_index[tag_name]]
    else:
        labels = None
    n_variables = len(input_variables)
    sensor_input = np.zeros(
        (sensors.shape[0], n_variables, history_length))
    sensor_diff_input = np.zeros(
        (sensors.shape[0], n_variables, history_length))

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

    for i, tag_name in enumerate(input_variables):
        for j in range(sensor_input.shape[0]):
            for jj in range(max(history_length + 1 - successive_mins_count[j], 0), history_length):
                k = j - history_length + jj - 1
                sensor_input[j, i, jj] = sensors[k, tags_to_index[tag_name]]
                sensor_diff_input[j, i, jj] = sensors[k, tags_to_index[tag_name]] - \
                    (sensors[k-1, tags_to_index[tag_name]]
                     if successive_mins_count[j] > 1 else 0)

    minutes_transformer = MinutesToHour()
    days_transformer = DayToPeriod()
    minute_input = minutes_transformer.transform(
        minutes_x.reshape((minutes_x.shape[0], 1)))
    minute_input = np.squeeze(minute_input)

    day_input = days_transformer.transform(
        days_x.reshape((days_x.shape[0], 1)))
    day_input = np.squeeze(day_input)

    outlier_filter_condition = None
    outlier_filter = None

    if y is not None:

        if efficiency_generative:

            if min_efficiency_threshold < 0 or min_efficiency_threshold > 100:
                raise ValueError(
                    f"The efficiency min threshold should be between 0 and 100, but it is {min_efficiency_threshold}.")

            efficiency = sensors[:, tags_to_index[EFFICIENCY_TAG]]
            if min_efficiency_threshold > 0:
                outlier_filter_condition = efficiency >= min_efficiency_threshold

            if min_diff_efficiency_threshold > -100:
                efficiency_diff = lagging_diff(
                    dataset=efficiency, days=days_x, minutes=minutes_x, n_lag=diff_lag) if diff_lag > 0 else efficiency
                outlier_filter_condition = outlier_filter_condition & \
                    (efficiency_diff >= min_diff_efficiency_threshold) \
                    if outlier_filter_condition is not None else efficiency_diff >= min_diff_efficiency_threshold

            if diff_efficiency_bucketing_type is not None and diff_efficiency_bucket_counts_quantile_cap is not None:
                filter_efficiency_diff_condition = bucketwise_filter_zero_inflation(
                    efficiency_diff, diff_efficiency_bucketing_type, diff_efficiency_bucket_counts_quantile_cap)
                outlier_filter_condition = outlier_filter_condition & filter_efficiency_diff_condition if \
                    outlier_filter_condition is not None else filter_efficiency_diff_condition
        else:
            excess_oxygens = []

            rc_var_tag = estimator_params["recommendation_condition_variable"] if \
                "recommendation_condition_variable" in estimator_params else None

            rc_variable = sensors[:, tags_to_index[rc_var_tag]
                                  ] if rc_var_tag is not None else None

            for oxygen_variable in oxygen_variables:
                excess_oxygens.append(
                    sensors[:, tags_to_index[oxygen_variable]])
                excess_oxygens.append(
                    sensors[:, tags_to_index[oxygen_variable]])

            if min_excess_oxygens_threshold is not None and max_excess_oxygens_threshold is not None:
                outlier_filter_conditions = []
                for excess_oxygen in excess_oxygens:
                    outlier_filter_condition = excess_oxygen >= min_excess_oxygens_threshold
                    outlier_filter_condition &= (
                        excess_oxygen <= max_excess_oxygens_threshold)
                    outlier_filter_conditions.append(outlier_filter_condition)

                outlier_filter_condition = outlier_filter_conditions[0] if len(
                    outlier_filter_conditions) > 0 else None
                for i in range(1, len(outlier_filter_conditions)):
                    outlier_filter_condition &= outlier_filter_conditions[i]

            if rc_variable is not None and max_rc is not None and min_rc is not None:
                outlier_filter_condition = rc_variable >= min_rc if outlier_filter_condition is None \
                    else outlier_filter_condition & (rc_variable >= min_rc)
                outlier_filter_condition &= (rc_variable <= max_rc)

            if max_diff_excess_oxygen_threshold is not None:
                eo_diffs = []
                for excess_oxygen in excess_oxygens:
                    eo_diffs.append(np.abs(lagging_diff(
                        dataset=excess_oxygen, days=days_x, minutes=minutes_x, n_lag=diff_lag) if diff_lag > 0 else excess_oxygen))
                if len(eo_diffs) > 0:
                    outlier_filter_condition = eo_diffs[0] if outlier_filter_condition is None else \
                        outlier_filter_condition & (
                            eo_diffs[0] <= max_diff_excess_oxygen_threshold)

                for i in range(1, len(outlier_filter_conditions)):
                    outlier_filter_condition &= (
                        eo_diffs[i] <= max_diff_excess_oxygen_threshold)

        if do_filtering:
            clf = IsolationForest(random_state=0).fit_predict(labels)
            outlier_filter_condition = clf == 1 if outlier_filter_condition is None else \
                outlier_filter_condition & clf == 1

        outlier_filter = None if outlier_filter_condition is None else np.where(
            outlier_filter_condition)

        if outlier_filter is not None:
            transformer.fit(labels[outlier_filter])
        else:
            transformer.fit(labels)
        labels = transformer.transform(labels)

    return (sensor_input, sensor_diff_input, minute_input, day_input, labels, outlier_filter)


def filter_zero_inflation(
        diff_mv_data: np.ndarray,
        retain_zero_ratio: float,
        near_zero_tolerance: float):
    """
    Filtering instances on MVs based on proximities to 0

    Args
    ----
    diff_mv_data : np.ndarray
        MV data in the form of differences.
    retain_zero_ratio : float
        What portion of the 0s to keep.
    near_zero_tolerance : float
        Threshold based on which we remove instances around 0.

    Returns
    -------
    mv_filter : np.ndarray
        Boolean mask for filtering.
    """

    scaled_mv_diff = np.abs(diff_mv_data)
    near_zero_values = scaled_mv_diff < (
        0 + near_zero_tolerance * scaled_mv_diff.std())
    near_zero_values_count = int(near_zero_values.sum())
    not_allowed_near_zero_values_count = int(
        near_zero_values_count * (1 - retain_zero_ratio))

    mv_filter = np.full(near_zero_values.shape, True, dtype=bool)
    seed(SEED)
    for i in range(near_zero_values.shape[0]):
        if near_zero_values[i] and randint(0, near_zero_values_count) < not_allowed_near_zero_values_count:
            mv_filter[i] = False

    return mv_filter


def bucketwise_filter_zero_inflation(
        diff_mv_data,
        bucketing_type,
        bucket_counts_quantile_cap):
    """
    Filtering instances based on MVs distribution of 0s.

    It forces to keep only a constant maximum number of 0s per bucket in a histogram

    Args
    ----
    diff_mv_data : np.ndarray
        MV data in the form of differences.
    bucketing_type : str
        Type of bucketing to use for forming a histogram
    bucket_counts_quantile_cap : int
        Number of zeroes to use as a cap to keep in each bin

    Returns
    -------
    mv_filter : np.ndarray
        Boolean mask for filtering.
    """

    scaled_mv_diff = np.abs(diff_mv_data)
    hist, edges = np.histogram(scaled_mv_diff, bins=bucketing_type)
    hist_quantile_cap = int(np.quantile(hist, bucket_counts_quantile_cap))
    sorted_indices = np.argsort(scaled_mv_diff)

    mv_filter = np.full(scaled_mv_diff.shape, False, dtype=bool)
    seed(SEED)

    current_edge_index = 1
    current_edge_value = edges[current_edge_index]

    for i in range(sorted_indices.shape[0]):
        index = sorted_indices[i]
        value = scaled_mv_diff[index]

        if value > current_edge_value:
            current_edge_index += 1

            if current_edge_index < edges.shape[0]:
                current_edge_value = edges[current_edge_index]
            else:
                break

        if randint(0, hist[current_edge_index - 1]) < hist_quantile_cap:
            mv_filter[index] = True

    return mv_filter


def _extract_input_and_cv_labels(
        estimator_params: Dict[str, Union[str, bool, int, float, None]],
        transformer,
        X: Dict[str, np.ndarray],
        y: Optional[np.ndarray] = None):

    sensors = X[SENSOR_INPUT_KIND]

    minutes_x = X[MINUTE_INPUT_KIND]
    days_x = X[DAY_INPUT_KIND]
    tags_to_index = estimator_params["tags_to_index"]

    cv_input_variables = estimator_params["cv_input_variables"]
    mv_input_variables = estimator_params["mv_input_variables"]
    output_variables = estimator_params["output_variables"] if y is not None else [
    ]
    do_filtering = estimator_params["do_filtering"]
    min_efficiency_threshold = estimator_params["min_efficiency_threshold"]

    if y is not None:
        labels = np.empty((y.shape[0], len(output_variables)))
        for i, tag_name in enumerate(output_variables):
            labels[:, i] = y[:, tags_to_index[tag_name]]
    else:
        labels = None
    n_cv_variables = len(cv_input_variables)
    n_mv_variables = len(mv_input_variables)
    sensor_input = np.zeros(
        (sensors.shape[0], n_cv_variables + n_mv_variables))

    for i, cv_name in enumerate(cv_input_variables):
        sensor_input[:, i] = sensors[:, tags_to_index[cv_name]]
    for i, mv_name in enumerate(mv_input_variables):
        sensor_input[:, i + n_cv_variables] = sensors[:,
                                                      tags_to_index[mv_name]]

    minutes_transformer = MinutesToHour()
    days_transformer = DayToPeriod()
    minute_input = minutes_transformer.transform(minutes_x)
    day_input = days_transformer.transform(days_x)

    augmented_sensor_inputs = list()
    augmented_minute_inputs = list()
    augmented_day_inputs = list()

    outlier_filter = None

    if y is not None:
        if min_efficiency_threshold < 0 or min_efficiency_threshold > 100:
            raise ValueError(
                f"The efficiency min threshold should be between 0 and 100, but it is {min_efficiency_threshold}.")
        if min_efficiency_threshold > 0:
            sensor_input = sensor_input[np.where(
                sensors[:, tags_to_index[EFFICIENCY_TAG]] >= min_efficiency_threshold)]
            minute_input = minute_input[np.where(
                sensors[:, tags_to_index[EFFICIENCY_TAG]] >= min_efficiency_threshold)]
            day_input = day_input[np.where(
                sensors[:, tags_to_index[EFFICIENCY_TAG]] >= min_efficiency_threshold)]
            labels = labels[np.where(
                sensors[:, tags_to_index[EFFICIENCY_TAG]] >= min_efficiency_threshold)]

        augmented_labels = list()

        augment_factor = estimator_params["augment_factor"]
        augment_threshold = estimator_params["efficiency_augment_threshold"]
        for i in range(sensors.shape[0]):
            efficiency = sensors[i, tags_to_index[EFFICIENCY_TAG]]
            if efficiency > augment_threshold:
                augmented_labels.append(
                    np.full((augment_factor, labels.shape[1]), labels[i]))
                augmented_sensor_inputs.append(
                    np.full((augment_factor, n_cv_variables + n_mv_variables), sensor_input[i, :]))
                augmented_minute_inputs.append(
                    np.full((augment_factor, 1), minute_input[i, :]))
                augmented_day_inputs.append(
                    np.full((augment_factor, 1), day_input[i, :]))

        augmented_labels.append(labels)

        labels = np.concatenate(augmented_labels)
        if do_filtering:
            clf = IsolationForest(random_state=0).fit_predict(labels)
            outlier_filter = np.where(clf == 1)

            transformer.fit(labels[outlier_filter])
        else:
            transformer.fit(labels)
        labels = transformer.transform(labels)

    augmented_sensor_inputs.append(sensor_input)
    augmented_minute_inputs.append(minute_input)
    augmented_day_inputs.append(day_input)

    sensor_input = np.concatenate(augmented_sensor_inputs)
    minute_input = np.concatenate(augmented_minute_inputs)
    day_input = np.concatenate(augmented_day_inputs)

    return (sensor_input, minute_input, day_input, labels, outlier_filter)


def _train_clutsers(
        clusters_n,
        output_variables,
        output_var_x):

    clusterers: Dict[str, BaseEstimator] = dict()

    for i, v_name in enumerate(output_variables):
        output = output_var_x[:, i, None]
        gmm = BayesianGaussianMixture(n_components=clusters_n)
        gmm.fit(output)
        clusterers[v_name] = gmm

    return clusterers


def build_diff(
        sensor_data: np.ndarray,
        days_x: np.ndarray,
        minutes_x: np.ndarray,
        sample_frequency: int = 1):
    successive_mins_count = list()
    successive_mins_counter = 0
    prev_day = days_x[0]
    prev_min = minutes_x[0]
    sample_frequency_reminder = 1440 % sample_frequency
    for i in range(days_x.shape[0]):
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

    if len(sensor_data.shape) > 1:
        for j in range(sensor_data.shape[1]):
            sensor_data[:, j] = np.ediff1d(sensor_data[:, j], to_begin=0)

        for i in range(sensor_data.shape[0]):
            if successive_mins_count[i] == 1:
                sensor_data[i, :] = 0
    else:
        sensor_data = np.ediff1d(sensor_data, to_begin=0)

        for i in range(sensor_data.shape[0]):
            if successive_mins_count[i] == 1:
                sensor_data[i] = 0

    return sensor_data


def lagging_diff(
        dataset: np.ndarray,
        days: np.ndarray,
        minutes: np.ndarray,
        n_lag: int):
    """
    Produces lagged feature(s) with a defined lag number.

    Args
    ----
    dataset : np.ndarray
        Either a single or multiple features to return lagged
    days : np.ndarray
        The tracked days.
    n_lag : int
        The lag to introduce in the data preparation.

    Returns
    -------
    diff_dataset : np.ndarray
        Dataset with the introduced lag.
    """

    diff_dataset = np.zeros(dataset.shape)

    if days.shape[0] > 0:
        prev_day = days[0]
    same_day_count = 0
    for i in range(days.shape[0]):
        current_day = days[i]
        if prev_day == current_day or (minutes[i] == 0 and (current_day == (prev_day + 1))):
            same_day_count += 1
            if same_day_count > n_lag:
                diff_dataset[i - n_lag] = dataset[i] - dataset[i - n_lag]
        else:
            same_day_count = 0

        prev_day = current_day

    return diff_dataset
