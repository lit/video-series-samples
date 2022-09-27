/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
let SlideButton = class SlideButton extends LitElement {
    render() {
        return html `<div
      part="internal-btn"
      id="btn"
      tabindex="0"
      role="button"
      aria-pressed="false"
    >
      <slot></slot>
    </div>`;
    }
};
SlideButton.styles = css `
    #btn {
      width: 2em;
      height: 2em;
      cursor: pointer;
      border-radius: 1em;

      display: flex;
      align-items: center;
      justify-content: center;

      box-shadow: var(
        --carousel-box-shadow,
        #293198 0.2em 0.2em 0.4em,
        #ceffff -0.1em -0.1em 0.2em
      );
    }

    #btn:active {
      box-shadow: var(
        --carousel-active-btn-box-shadow,
        inset #293198 0.2em 0.2em 0.4em,
        inset #ceffff -0.1em -0.1em 0.2em
      );
      background-color: var(--carousel-active-btn-background-color);
      color: var(--carousel-active-btn-color);
    }

    ::slotted(svg) {
      width: 1em;
      height: 1em;
    }
  `;
SlideButton = __decorate([
    customElement("slide-button")
], SlideButton);
//# sourceMappingURL=slide-button.js.map