import Entity from './Entity';
import createRequest from './createRequest';

export default class ChatAPI extends Entity {
    register(options, callback) {
        createRequest(options, callback);
    }
}