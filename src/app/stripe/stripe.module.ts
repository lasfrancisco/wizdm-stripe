import { APP_INITIALIZER, PLATFORM_ID, NgModule, ModuleWithProviders, Inject, Optional, forwardRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StripeConfig, StripeConfigToken, loadStripeJS, getStripeJS, stripeFactory  } from './stripe-factory';
import { StripeControl } from './stripe-control';
import { StripeConnect } from './stripe-connect';
import { StripeMaterial } from './stripe-material';
import { StripeElements } from './stripe-elements';
import { StripeCard } from './stripe-card';
import { StripeCardNumber } from './stripe-card-number';
import { StripeCardExpiry} from './stripe-card-expiry';
import { StripeCardCvc } from './stripe-card-cvc';
import { StripeIban } from './stripe-iban';
import { StripeIdeal } from './stripe-ideal';
import { Stripe } from './stripe-definitions';

export const STRIPE_EXPORTS = [
  StripeControl, StripeConnect, StripeMaterial, StripeElements, 
  StripeCard, StripeCardNumber, StripeCardExpiry, StripeCardCvc, 
  StripeIban, StripeIdeal
];

@NgModule({
  imports: [ /*CommonModule*/ ],
  declarations: STRIPE_EXPORTS,
  exports: STRIPE_EXPORTS
})
export class StripeModule {

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if( !isPlatformBrowser(platformId) ) {
      throw new Error('StripeModule package supports Browsers only');
    }
  }

  static init(config: StripeConfig): ModuleWithProviders<StripeModule> {
    return {
      ngModule: StripeModule,
      providers: [
        /** Loads the Stripe.js script during app initialization */
        { provide: APP_INITIALIZER, useValue: loadStripeJS, multi: true },
        /** Provides the global StripeConfig object */
        { provide: StripeConfigToken, useValue: config },
        /** Provides StripeJS as an injectable */ 
        { provide: 'StripeJS', useFactory: getStripeJS },
        /** Provides a Stripe instancce as an injectable service. Stripe has been defined as an abstract class 
         * to be purposely used as a valid token while stripeFactory() provides a stripe instance configured
         * according to the global StripeConfig object. */
        { provide: Stripe,
          useFactory: stripeFactory, 
          deps: [ [ new Optional(), new Inject(StripeConfigToken) ] ] },
        /** Provides a global StripeElements injectable reverting to Stripe.elements() in the eventuality
         * the stripe components are used without or out of a <wm-stripe-elements> container. */
        { provide: StripeElements,
          useFactory: (stripe: Stripe, config: StripeConfig) => stripe.elements(config.elementsOptions),
          deps: [ forwardRef(() => Stripe), [  new Optional(), new Inject(StripeConfigToken) ] ] }
      ]
    };
  } 
}