import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

// Login Redux States
import { CHECK_LOGIN, LOGOUT_USER } from './actionTypes';
import { apiError, loginUserSuccessful, logoutUserSuccess } from './actions';

// AUTH related methods
import { getFirebaseBackend } from '../../../helpers/firebase_helper';

// Initialize Firebase
const fireBaseBackend = getFirebaseBackend();

// If user logs in, dispatch redux actions directly from here.
function* loginUser({ payload: { user, history } }) {
    try {
        let response;
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            response = yield call(fireBaseBackend.loginUser, user.username, user.password);
        } else {
            // Call your actual backend login API here instead of `postLogin`.
            response = yield call("api", '/login', { username: user.username, password: user.password });
        }

        // Store user info in local storage or as needed.
        localStorage.setItem("authUser", JSON.stringify(response));
        yield put(loginUserSuccessful(response));
        history('/dashboard');
    } catch (error) {
        yield put(apiError(error));
    }
}

function* logoutUser({ payload: { history } }) {
    try {
        localStorage.removeItem("authUser");

        if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
            yield call(fireBaseBackend.logout);
        }

        yield put(logoutUserSuccess());
        history('/login');
    } catch (error) {
        yield put(apiError(error));
    }
}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser);
}

export function* watchUserLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser);
}

function* loginSaga() {
    yield all([
        fork(watchUserLogin),
        fork(watchUserLogout),
    ]);
}

export default loginSaga;