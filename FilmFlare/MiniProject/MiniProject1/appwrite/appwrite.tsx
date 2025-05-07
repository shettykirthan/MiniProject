    // import {Client, Account} from 'appwrite';

    // export const client = new Client();

    // client
    //     .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint')
    //     .setProject("67cb40b4000f4de5fb71")


    // export const account = new Account(client);

    // export {ID} from 'appwrite'

    import { Client, Account, Databases , Storage } from 'appwrite';

    export const API_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
    export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
    export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
    export const MOVIE_PREFERENCE_ID = import.meta.env.VITE_MOVIE_PREFERENCE_ID;
    
    export const BUCKET_ID = '';


    // export const Events= 'Eventid';
    // export const currentEvent= 'currentevent';


    const client = new Client()
        .setEndpoint(API_ENDPOINT)
        .setProject(PROJECT_ID);

    export const account = new Account(client);
    export const databases = new Databases(client);
    export const storage = new Storage(client);

    export default client;



