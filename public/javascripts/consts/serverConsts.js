const REGISTER = 30 * 1000; // Time in milliseconds (30 seconds)
const MESSAGES_QUERY_FAILED = 'There was an error querying messages';
const MESSAGE_UPDATED = 'Message updated successfully';
const UPDATE_MESSAGE_VALIDATION_ERR = 'Validation error in updating message';
const UPDATE_MESSAGE_FAILED = 'Internal server error in updating message';
const MESSAGE_QUERY_FAILED = 'There was an error querying message';
const MESSAGE_DELETED = 'message deleted successfully';
const DELETE_MESSAGE_VALIDATION_ERR = 'Validation error in deleting message';
const DELETE_MESSAGE_FAILED = 'Internal server error in deleting message';
const UNAUTHORIZED_ACCESS = 'Unauthorized access - user is not logged in. ';
const INTERNAL_SERVER_ERR = 'Internal Server Error';
const GENERAL_LOGOUT_ERR_MSG = 'An error occurred during logout. Please try again later.';

module.exports = {
    REGISTER,
    MESSAGES_QUERY_FAILED,
    MESSAGE_UPDATED,
    UPDATE_MESSAGE_VALIDATION_ERR,
    UPDATE_MESSAGE_FAILED,
    MESSAGE_QUERY_FAILED,
    MESSAGE_DELETED,
    DELETE_MESSAGE_VALIDATION_ERR,
    DELETE_MESSAGE_FAILED,
    UNAUTHORIZED_ACCESS,
    INTERNAL_SERVER_ERR,
    GENERAL_LOGOUT_ERR_MSG
};