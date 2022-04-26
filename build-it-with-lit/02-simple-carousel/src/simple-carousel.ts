/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css, PropertyValues } from "lit";
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  AnimationTuple,
  SLIDE_LEFT_IN,
  SLIDE_LEFT_OUT,
  SLIDE_RIGHT_IN,
  SLIDE_RIGHT_OUT,
  BOOTSTRAP_CHEVRON_LEFT,
  BOOTSTRAP_CHEVRON_RIGHT,
} from "./constants.js";

import "./slide-button.js";

@customElement("simple-carousel")
export class SimpleCarousel extends LitElement {
  static override styles = css`
    ::slotted(.slide-hidden) {
      display: none;
    }

    /** So the elements all overlap */
    ::slotted(*) {
      position: absolute;
      padding: 1em;
    }

    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: 500px;
    }

    #container {
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      margin: 0 18px;

      padding: 1em;
      overflow: hidden;
      position: relative;

      box-shadow: var(--shadow, gray) 0.3em 0.3em 0.4em,
        var(--highlight, white) -0.1em -0.1em 0.3em;
    }
  `;

  // Assume this is always a valid slide index.
  @property({ type: Number }) slideIndex = 0;
  @state() private containerHeight = 0;
  @queryAssignedElements() private readonly slideElements!: HTMLElement[];

  /**
   * Return slide index in the range of [0, slideElement.length)
   */
  get wrappedIndex(): number {
    return wrap(this.slideIndex, this.slideElements.length);
  }

  override render() {
    const containerStyles = {
      height: `${this.containerHeight}px`,
    };

    return html`<slide-button
        onClick=${this.navigateToPrevSlide}
        @click=${this.navigateToPrevSlide}
      >
        ${BOOTSTRAP_CHEVRON_LEFT}
      </slide-button>

      <div id="container" style="${styleMap(containerStyles)}">
        <slot></slot>
      </div>

      <slide-button
        onClick=${this.navigateToNextSlide}
        @click=${this.navigateToNextSlide}
      >
        ${BOOTSTRAP_CHEVRON_RIGHT}
      </slide-button>`;
  }

  override firstUpdated() {
    this.containerHeight = getMaxElHeight(this.slideElements);
    this.initializeSlides();
  }

  override updated(changedProperties: PropertyValues<this>): void {
    // Not covered in the video, but if you want to drive animations from the
    // 'slideindex' attribute and property, we can calculate the animation in
    // the 'updated' lifecycle callback.
    if (changedProperties.has("slideIndex")) {
      const oldSlideIndex = changedProperties.get("slideIndex");
      const advancing = this.slideIndex > oldSlideIndex;

      if (advancing) {
        // Animate forwards
        this.navigateWithAnimation(1, SLIDE_LEFT_OUT, SLIDE_RIGHT_IN);
      } else {
        // Animate backwards
        this.navigateWithAnimation(-1, SLIDE_RIGHT_OUT, SLIDE_LEFT_IN);
      }
    }
  }

  navigateToNextSlide = () => {
    // Animation driven by the `updated` lifecycle.
    this.slideIndex += 1;
  };

  navigateToPrevSlide = () => {
    // Animation driven by the `updated` lifecycle.
    this.slideIndex -= 1;
  };

  private async navigateWithAnimation(
    nextSlideOffset: number,
    leavingAnimation: AnimationTuple,
    enteringAnimation: AnimationTuple
  ) {
    this.initializeSlides();
    const wrappedPriorIdx = wrap(
      this.slideIndex - nextSlideOffset,
      this.slideElements.length
    );
    const elLeaving = this.slideElements[wrappedPriorIdx];
    showSlide(elLeaving);

    // Animate out current element
    const leavingAnim = elLeaving.animate(
      leavingAnimation[0],
      leavingAnimation[1]
    );

    // Entering slide
    const newSlideEl = this.slideElements[this.wrappedIndex];

    // Show the new slide
    showSlide(newSlideEl);

    // Teleport it out of view and animate it in
    const enteringAnim = newSlideEl.animate(
      enteringAnimation[0],
      enteringAnimation[1]
    );

    try {
      // Wait for animations
      await Promise.all([leavingAnim.finished, enteringAnim.finished]);

      // Hide the element that left
      hideSlide(elLeaving);
    } catch {
      /* Animation was cancelled */
    }
  }

  private initializeSlides() {
    for (let i = 0; i < this.slideElements.length; i++) {
      const slide = this.slideElements[i];
      slide.getAnimations().forEach((anim) => anim.cancel());
      if (i === this.wrappedIndex) {
        showSlide(slide);
      } else {
        hideSlide(slide);
      }
    }
  }
}

function getMaxElHeight(els: HTMLElement[]): number {
  return Math.max(0, ...els.map((el) => el.getBoundingClientRect().height));
}

function hideSlide(el: HTMLElement) {
  el.classList.add("slide-hidden");
}

function showSlide(el: HTMLElement) {
  el.classList.remove("slide-hidden");
}

function wrap(idx: number, max: number): number {
  return ((idx % max) + max) % max;
}

declare global {
  interface HTMLElementTagNameMap {
    "simple-carousel": SimpleCarousel;
  }
}
