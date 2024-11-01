// eslint-disable-next-line max-classes-per-file
import API_ERROR_CODE from './constants/errorCodes';
import MESSAGES from './messages';

export class ClientError extends Error {
	constructor(message = MESSAGES.CLIENT_ERROR, name = API_ERROR_CODE.CLIENT_ERROR) {
		super(message);
		this.name = name;
	}
}

export class APIError extends Error {
	status: number;

	constructor(message = MESSAGES.API_FETCH_ERROR, status = 500, name = API_ERROR_CODE.API_FETCH_ERROR) {
		super(message);
		this.name = name;
		this.status = status;
	}
}
