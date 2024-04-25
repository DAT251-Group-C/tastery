// microsoft-translator.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from '../../common/config/app-conf'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Observable, combineLatest, from, map, of, switchMap, tap } from 'rxjs';





@Injectable()
export class TranslatorService {
  private key: string | undefined;
  private location = "swedencentral";
  private endpoint = "https://api.cognitive.microsofttranslator.com";

  constructor(
    @Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>,
  ) {}

  public translateText(text: string): Observable<string> {
    console.log(this.config);
    this.key = this.config.microsoftTranslator.key;
    return from(axios({
      method: 'post',
      url: `${this.endpoint}/translate`,
      headers: {
        'Ocp-Apim-Subscription-Key': this.key,
        'Ocp-Apim-Subscription-Region': this.location,
        'Content-Type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'from': 'en',
        'to': 'nb'
      },
      data: [{ 'text': text }],
      responseType: 'json'
    })).pipe(
      map(response => response.data[0].translations[0].text)
    );
  }
}

  /* public async translateText(text: string): Promise<string> {
    
    const response = await axios({
        method: 'post',
        url: `${this.endpoint}/translate`,
        headers: {
            'Ocp-Apim-Subscription-Key': "10fff1687325432691199d671f203dc3",
            //'Ocp-Apim-Subscription-Key': this.key,
            'Ocp-Apim-Subscription-Region': this.location,
            'Content-Type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'from': 'en',
            'to': 'nb'
        },
        data: [{ 'text': text }],
        responseType: 'json'
    });
    console.log(response);
    return response.data[0].translations[0].text; // Accessing the translated text
    } */

