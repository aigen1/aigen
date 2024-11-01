import API_ERROR_CODE from './constants/errorCodes';

const MESSAGES = {
	[API_ERROR_CODE.API_FETCH_ERROR]: 'Something went wrong while fetching data. Please try again later.',
	[API_ERROR_CODE.INVALID_PARAMS_ERROR]: 'Invalid parameters passed to the url.',
	[API_ERROR_CODE.INVALID_SEARCH_PARAMS_ERROR]: 'Invalid parameters passed to the url.',
	[API_ERROR_CODE.SUBSQUID_FETCH_ERROR]: 'Something went wrong while fetching onchain data. Please try again later.',
	[API_ERROR_CODE.REQ_BODY_ERROR]: 'Something went wrong while parsing the request body.',
	[API_ERROR_CODE.CLIENT_ERROR]: 'Something went wrong while fetching data on the client. Please try again later.',
	[API_ERROR_CODE.REACTION_ACTION_ERROR]: 'Something went wrong while doing reaction action. Please try again later.',
	[API_ERROR_CODE.POST_NOT_FOUND_ERROR]: 'Post not found.',
	[API_ERROR_CODE.ADDRESS_NOT_FOUND_ERROR]: 'Address not found.',
	[API_ERROR_CODE.USER_NOT_FOUND_ERROR]: 'User not found.',
	[API_ERROR_CODE.GITHUB_FETCH_ERROR]: 'Something went wrong while fetching data from github. Please try again later.'
};

export default MESSAGES;
