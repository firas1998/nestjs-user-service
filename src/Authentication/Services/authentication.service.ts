import { HttpService, Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Request } from 'express';

@Injectable()
export class AuthenticationService {
    /**
     * Creates an instance of AuthenticationService.
     * @memberof AuthenticationService
     */
    public constructor(private readonly httpService: HttpService) {
        firebase.initializeApp({
            credential: firebase.credential.cert(
                process.env.FIREBASE_CREDENTIALS_PATH
            ),
            databaseURL: process.env.AUTH_DATABASE_URL
        });
    }

    /**
     *
     *
     * @param {Request} request
     * @returns {Promise<boolean>}
     * @memberof AuthenticationService
     */
    public async verifyToken(request: Request): Promise<boolean> {
        const userId = await this.getUserIdFromRequest(request);
        if (userId) {
            return true;
        }
        return false;
    }

    /**
     *
     *
     * @param {Request} request
     * @returns {Promise<string>}
     * @memberof AuthenticationService
     */
    public async getUserIdFromRequest(request: Request): Promise<string> {
        try {
            const authHeader = request.header('Authorization');
            const token = authHeader.substring(7, authHeader.length);
            const decodedToken = await firebase.auth().verifyIdToken(token);
            return decodedToken.uid;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     *
     *
     * @param {string} uuid
     * @returns {Promise<string>}
     * @memberof AuthenticationService
     */
    public async generateIdTokenForTesting(uuid: string): Promise<string> {
        const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.GOOGLE_API_KEY}`;
        const customToken = await firebase.auth().createCustomToken(uuid);

        const data = {
            token: customToken,
            returnSecureToken: true
        };

        const resp = await this.httpService.post(url, data).toPromise();
        return resp.data.idToken;
    }
}
