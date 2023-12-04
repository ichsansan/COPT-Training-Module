from typing import List, Tuple, Dict
from sklearn.base import TransformerMixin, BaseEstimator
from sklearn.pipeline import Pipeline
import numpy as np
import math

MINUTE_INPUT_KIND = "minute_input"
DAY_INPUT_KIND = "day_input"
SENSOR_INPUT_KIND = "sensor_input"
PRESENT_INDICES = "present_indices"
PRESENT_INPUT = "present_input"

class BenchmarkTransformer(TransformerMixin):
    """It consolidates the input needed
    for the mapping models."""

    def __init__(self, transformers: List[Tuple[str, Pipeline]]):
        self.transformers = transformers

    def fit(self, X, y=None):

        for n, t in self.transformers:
            if isinstance(X[n], list):
                t.fit(np.array(X[n]). reshape((len(X[n]), 1)), y)
            else:
                if len(X[n].shape) > 1:
                    t.fit(X[n], y)
                else:
                    t.fit(X[n].reshape((X[n].shape[0], 1)), y)

        return self

    def transform(self, X: Dict[str, np.ndarray]):
        x: Dict[str, np.ndarray] = dict()

        for n, t in self.transformers:
            if isinstance(X[n], list):
                x[n] = list(t.transform(np.array(X[n]). reshape(
                    (len(X[n]), 1))).reshape((len(X[n]),)))
            else:
                if len(X[n].shape) > 1:
                    x[n] = t.transform(X[n])
                else:
                    x[n] = t.transform(X[n].reshape((X[n].shape[0], 1)))
                    x[n] = np.squeeze(x[n])

        return x

    def get_params(self):
        return self._get_params('transformers')

    def set_params(self, **kwargs):
        self._set_params('transformers', **kwargs)
        return self


class BlankTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X

    def inverse_transform(self, X):
        return X


class CorrFilter(BaseEstimator, TransformerMixin):
    def __init__(self, corr_threshold: float, max_count: int):
        self.corr_threshold = corr_threshold
        self.max_count = max_count

    def fit(self, X, y=None):
        corr = np.abs(np.corrcoef(np.transpose(y.reshape((y.shape[0], 1))), X, False))
        sorted_indices_x = np.argsort(-corr[0, 1:])

        corr = np.abs(np.corrcoef(np.transpose(X)))
        to_keep = list()
        to_keep.append(sorted_indices_x[0])
        for j in sorted_indices_x[1:]:
            if len(to_keep) > self.max_count:
                break

            if np.all(corr[to_keep, j] < self.corr_threshold):
                to_keep.append(j)

        self.to_keep = to_keep

        return self

    def fit_transform(self, X, y):
        self.fit(X, y)
        return X[:, self.to_keep]

    def transform(self, X):

        return X[:, self.to_keep]

    def inverse_transform(self, X):
        return X


class MinutesToDayPeriod(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        assert isinstance(X, np.ndarray)
        if len(X.shape) > 2 or X.shape[1] != 1:
            raise ValueError("Not supported shape of X.")

        x = np.empty(X.shape)

        lim_a = (4 / 24) * 1440
        lim_b = (8 / 24) * 1440
        lim_c = 0.5 * 1440
        lim_d = (16 / 24) * 1440
        lim_e = (18 / 24) * 1440

        for i in range(X.shape[0]):
            is_a = X[i, 0] <= lim_a

            x[i, 0] = 0 if is_a else 1 if X[i, 0] <= lim_b else 2 if X[i, 0] <= lim_c else 3 if X[i, 0] <= lim_d \
                else 4 if X[i, 0] <= lim_e else 5

        return x


class MinutesToHour(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        assert isinstance(X, np.ndarray)
        if len(X.shape) > 2 or X.shape[1] != 1:
            raise ValueError("Not supported shape of X.")

        x = np.empty(X.shape)
        for i in range(X.shape[0]):
            x[i, 0] = int(X[i, 0] / 60)

        return x


class DayToPeriod(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        assert isinstance(X, np.ndarray)

        x = np.empty(X.shape)

        if len(X.shape) > 2 or X.shape[1] != 1:
            raise ValueError("Not supported shape of X.")

        for i in range(X.shape[0]):
            x[i, 0] = X[i, 0] % 7

        return x


class DayToSeasonal(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        assert isinstance(X, np.ndarray)

        x = np.empty(X.shape)

        if len(X.shape) > 2 or X.shape[1] != 1:
            raise ValueError("Not supported shape of X.")

        # TODO: Use timedelta and offset to discern between high year and normal year for modulo operand?
        for i in range(X.shape[0]):
            x[i, 0] = math.ceil(((X[i, 0] % 365)) / 30.4368)

        return x
