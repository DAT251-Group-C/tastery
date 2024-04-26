import { Injectable, Inject } from '@nestjs/common';
import { TranslatorService } from '../translator/translator.service';
import { Observable, from, of } from 'rxjs';
import appConfig from '../../common/config/app-conf'
import { ConfigType } from '@nestjs/config';
import { catchError, concatMap, map, switchMap, toArray } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';




@Injectable()
export class KassalappService {
  private readonly baseURL = 'https://kassal.app/api/v1';

  constructor(
    @Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>,
    private httpService: HttpService,
    private translatorService: TranslatorService
  ) {}

  searchProducts(originalText: string): Observable<any> {
    return this.translatorService.translateText(originalText).pipe(
      switchMap(translatedText => {
        const url = `${this.baseURL}/products?search=${encodeURIComponent(translatedText)}&sort=price_asc&price_min=5`;
        const headersRequest = {
          headers: {
            Authorization: `Bearer ${this.config.kassalapp.key}`
          }
        };
        return this.httpService.get(url, headersRequest).pipe(
          map(response => {
            return response.data;
          }
        )
    )
      })
    );
  }

  searchBestPriceForProducts(ingredients: string[]): Observable<any[]> {
    return from(ingredients).pipe(
        concatMap(ingredient => 
            this.searchProducts(ingredient).pipe(
                map(results => results.data && results.data.length > 0 ? results.data[0].current_price : null),
                catchError(error => {
                    console.error('Error retrieving product details:', error);
                    return of(null); // Ensure returning Observable if error occurs
                })
            )
        ),
        toArray(), // Aggregate results into an array
        catchError(error => {
            console.error('Error processing ingredients:', error);
            return of([]); // Return an Observable of an empty array in case of an error
        })
    );
}
}
