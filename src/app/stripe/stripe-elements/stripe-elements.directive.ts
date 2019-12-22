import { Component, Directive, OnInit, OnChanges, SimpleChanges, Input, Inject } from '@angular/core';
import { Elements, ElementsOptions, Element, ElementType, ElementOptions } from '../stripe-definitions/element';
import { StripeConfig, StripeConfigToken } from '../stripe-factory';
import { Stripe } from '../stripe-definitions';

@Directive({
  selector: 'wm-stripe-elements, [StripeElements]',
  exportAs: 'StripeElements'
})
export class StripeElements implements OnInit, OnChanges, Elements {

  public elements: Elements;

  constructor(readonly stripe: Stripe, @Inject(StripeConfigToken) private config: StripeConfig) { }

  ngOnInit() {
    // Gets a new elements instance with a custom locale
    this.elements = this.stripe.elements({ 

      // Merges the Elements' options with the custom locale
      ...this.config.elementsOptions, 
      
      locale: this.locale 
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Renew the elements instance with the new locale
    this.elements && this.ngOnInit();
  }

  /** Custom Locale to apply to Elements to */
  @Input() locale: string; 

  /**
   * Creates an Element of elementType with the given options
   */
  public create<T extends ElementType>(elementType: T, options?: ElementOptions<T>): Element<T> {
    return this.elements && this.elements.create(elementType, options);
  }  

  /**
   * Gets an existing intance of the requested element type
   */
  public getElement<T extends ElementType>(type: T): Element<T> {
    return this.elements.getElement(type);
  }
}
