import {send} from './APIService';

/**
 * Method for fetching all available streams from API
 *
 * @method getAllStreams
 * @param {Function} success - function that will be invoked after request success
 */
export function getAllStreams(success) {
    send(
        'GET',
        '/streams',
        undefined,
        (res) => {
            success(res);
        },
        (error) => {
            console.log(`Request failed: ${error}`);
        }
    );
}

/**
 * Method for fetching streams from API filtered by current active filters
 *
 * @method getFilteredStreams
 * @param {Object} streamLanguage - when streamLanguage.set is 'true' then this filter is active
 * @param {Object} broadcasterLanguage - when broadcasterLanguage.set is 'true' then this filter is active
 * @param {String} gameFilter - game name filter
 * @param {Function} success - function that will be invoked after request success
 */
export function getFilteredStreams(streamLanguage, broadcasterLanguage, gameFilter, success) {

    let streamLang = streamLanguage.set ? streamLanguage.language : '';
    let broadcastLang = broadcasterLanguage.set ? broadcasterLanguage.language : '';

    let url = gameFilter ?
        `/search/streams?q=${gameFilter.replace(' ', '+')}&type=suggest` :
        `/streams?language=${streamLang}&broadcaster_language=${broadcastLang}`;
    
    send(
        'GET',
        url,
        undefined,
        (streams) => {
            if(gameFilter && (streamLanguage.set || broadcasterLanguage.set))
                streams.streams = filterGameByLanguage(streams.streams, streamLang, broadcastLang);
            success(streams);
        },
        (error) => {
            console.log(`Request failed: ${error}`);
        }
    );
}

/**
 * Method for filtering streams by stream language or/and broadcaster language
 *
 * @method filterGameByLanguage
 * @param {Array} streams - fetched streams
 * @param {String} streamLanguage - currently active stream language
 * @param {String} broadcasterLanguage - currently active broadcaster language
 * @return {Array} streamsFiltered - array contains streams filtered by stream language or/and broadcaster language
 */
function filterGameByLanguage(streams, streamLanguage, broadcasterLanguage) {
    let streamsFiltered = [];
    
    for (let index in streams) {
        if (streamLanguage && streams[index].channel.language === streamLanguage) 
            streamsFiltered.push(streams[index]);
        if (broadcasterLanguage && streams[index].channel.broadcaster_language === broadcasterLanguage) 
            streamsFiltered.push(streams[index]);
    }
    
    return streamsFiltered;
}



