<template>
  <div id="options-grid" class="options-grid">
    <div class="options-el">
      <h1 class="options-header">Colors</h1>
      <div class="color-grid">
        <div
          @click="$emit('colorMain', '#ff006e', '#EE0063')"
          @contextmenu="$emit('colorSecond', '#ff006e')"
          class="rounded color-sub"
          style="background-color: #ff006e;"
        >
          <svg
            class="selected_icon selected_icon_active"
            viewBox="0 0 63.95 63.95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.98 0A31.98 31.98 0 000 31.97a31.98 31.98 0 0031.98 31.98 31.98 31.98 0 0031.97-31.98A31.98 31.98 0 0031.98 0zm4.6 11.75c.69-.16.97.1.8.79v39.7h-5.14V18.12L21.91 21.9v-4.64l14.68-5.5z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
          <svg
            class="selected_icon selected_icon_active2"
            viewBox="0 0 62.13 62.13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.06 0A31.06 31.06 0 000 31.06a31.06 31.06 0 0031.06 31.07 31.06 31.06 0 0031.07-31.07A31.06 31.06 0 0031.06 0zm-.11 10.98c3.5 0 6.26.91 8.3 2.76 2.02 1.82 3.04 4.26 3.04 7.3 0 3.71-2.37 8.12-7.09 13.24L25.14 45.2h18.88v3.9H19.37v-3.44l13.02-14.46a30.62 30.62 0 003.98-5.33 8.87 8.87 0 001.12-4.25c0-1.97-.6-3.58-1.8-4.84a6.24 6.24 0 00-4.74-1.89c-2.38 0-4.24.68-5.56 2.04-1.31 1.35-1.96 3.22-1.96 5.63h-4.78c0-3.46 1.11-6.26 3.33-8.4 2.24-2.13 5.23-3.2 8.97-3.2z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
        </div>
        <div
          @click="$emit('colorMain', '#3a86ff', '#3479EF')"
          @contextmenu="$emit('colorSecond', '#3a86ff')"
          class="rounded color-sub"
          style="background-color: #3a86ff;"
        >
          <svg
            class="selected_icon"
            viewBox="0 0 63.95 63.95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.98 0A31.98 31.98 0 000 31.97a31.98 31.98 0 0031.98 31.98 31.98 31.98 0 0031.97-31.98A31.98 31.98 0 0031.98 0zm4.6 11.75c.69-.16.97.1.8.79v39.7h-5.14V18.12L21.91 21.9v-4.64l14.68-5.5z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
          <svg
            class="selected_icon"
            viewBox="0 0 62.13 62.13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.06 0A31.06 31.06 0 000 31.06a31.06 31.06 0 0031.06 31.07 31.06 31.06 0 0031.07-31.07A31.06 31.06 0 0031.06 0zm-.11 10.98c3.5 0 6.26.91 8.3 2.76 2.02 1.82 3.04 4.26 3.04 7.3 0 3.71-2.37 8.12-7.09 13.24L25.14 45.2h18.88v3.9H19.37v-3.44l13.02-14.46a30.62 30.62 0 003.98-5.33 8.87 8.87 0 001.12-4.25c0-1.97-.6-3.58-1.8-4.84a6.24 6.24 0 00-4.74-1.89c-2.38 0-4.24.68-5.56 2.04-1.31 1.35-1.96 3.22-1.96 5.63h-4.78c0-3.46 1.11-6.26 3.33-8.4 2.24-2.13 5.23-3.2 8.97-3.2z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
        </div>
        <div
          @click="$emit('colorMain', '#44bba4', '#3DAB94')"
          @contextmenu="$emit('colorSecond', '#44bba4')"
          class="rounded color-sub"
          style="background-color: #44bba4;"
        >
          <svg
            class="selected_icon"
            viewBox="0 0 63.95 63.95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.98 0A31.98 31.98 0 000 31.97a31.98 31.98 0 0031.98 31.98 31.98 31.98 0 0031.97-31.98A31.98 31.98 0 0031.98 0zm4.6 11.75c.69-.16.97.1.8.79v39.7h-5.14V18.12L21.91 21.9v-4.64l14.68-5.5z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
          <svg
            class="selected_icon"
            viewBox="0 0 62.13 62.13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.06 0A31.06 31.06 0 000 31.06a31.06 31.06 0 0031.06 31.07 31.06 31.06 0 0031.07-31.07A31.06 31.06 0 0031.06 0zm-.11 10.98c3.5 0 6.26.91 8.3 2.76 2.02 1.82 3.04 4.26 3.04 7.3 0 3.71-2.37 8.12-7.09 13.24L25.14 45.2h18.88v3.9H19.37v-3.44l13.02-14.46a30.62 30.62 0 003.98-5.33 8.87 8.87 0 001.12-4.25c0-1.97-.6-3.58-1.8-4.84a6.24 6.24 0 00-4.74-1.89c-2.38 0-4.24.68-5.56 2.04-1.31 1.35-1.96 3.22-1.96 5.63h-4.78c0-3.46 1.11-6.26 3.33-8.4 2.24-2.13 5.23-3.2 8.97-3.2z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
        </div>
        <div
          @click="$emit('colorMain', '#ffbf00', '#EBAC00')"
          @contextmenu="$emit('colorSecond', '#ffbf00')"
          class="rounded color-sub"
          style="background-color: #ffbf00;"
        >
          <svg
            class="selected_icon"
            viewBox="0 0 63.95 63.95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.98 0A31.98 31.98 0 000 31.97a31.98 31.98 0 0031.98 31.98 31.98 31.98 0 0031.97-31.98A31.98 31.98 0 0031.98 0zm4.6 11.75c.69-.16.97.1.8.79v39.7h-5.14V18.12L21.91 21.9v-4.64l14.68-5.5z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
          <svg
            class="selected_icon"
            viewBox="0 0 62.13 62.13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.06 0A31.06 31.06 0 000 31.06a31.06 31.06 0 0031.06 31.07 31.06 31.06 0 0031.07-31.07A31.06 31.06 0 0031.06 0zm-.11 10.98c3.5 0 6.26.91 8.3 2.76 2.02 1.82 3.04 4.26 3.04 7.3 0 3.71-2.37 8.12-7.09 13.24L25.14 45.2h18.88v3.9H19.37v-3.44l13.02-14.46a30.62 30.62 0 003.98-5.33 8.87 8.87 0 001.12-4.25c0-1.97-.6-3.58-1.8-4.84a6.24 6.24 0 00-4.74-1.89c-2.38 0-4.24.68-5.56 2.04-1.31 1.35-1.96 3.22-1.96 5.63h-4.78c0-3.46 1.11-6.26 3.33-8.4 2.24-2.13 5.23-3.2 8.97-3.2z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
        </div>
        <div
          @click="$emit('colorMain', '#ff822e', '#EC7529')"
          @contextmenu="$emit('colorSecond', '#ff822e')"
          class="rounded color-sub"
          style="background-color: #ff822e;"
        >
          <svg
            class="selected_icon"
            viewBox="0 0 63.95 63.95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.98 0A31.98 31.98 0 000 31.97a31.98 31.98 0 0031.98 31.98 31.98 31.98 0 0031.97-31.98A31.98 31.98 0 0031.98 0zm4.6 11.75c.69-.16.97.1.8.79v39.7h-5.14V18.12L21.91 21.9v-4.64l14.68-5.5z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
          <svg
            class="selected_icon"
            viewBox="0 0 62.13 62.13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.06 0A31.06 31.06 0 000 31.06a31.06 31.06 0 0031.06 31.07 31.06 31.06 0 0031.07-31.07A31.06 31.06 0 0031.06 0zm-.11 10.98c3.5 0 6.26.91 8.3 2.76 2.02 1.82 3.04 4.26 3.04 7.3 0 3.71-2.37 8.12-7.09 13.24L25.14 45.2h18.88v3.9H19.37v-3.44l13.02-14.46a30.62 30.62 0 003.98-5.33 8.87 8.87 0 001.12-4.25c0-1.97-.6-3.58-1.8-4.84a6.24 6.24 0 00-4.74-1.89c-2.38 0-4.24.68-5.56 2.04-1.31 1.35-1.96 3.22-1.96 5.63h-4.78c0-3.46 1.11-6.26 3.33-8.4 2.24-2.13 5.23-3.2 8.97-3.2z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
        </div>
        <div
          @click="$emit('colorMain', '#a937c8', '#9C32BC')"
          @contextmenu="$emit('colorSecond', '#a937c8')"
          class="rounded color-sub"
          style="background-color: #a937c8;"
        >
          <svg
            class="selected_icon"
            viewBox="0 0 63.95 63.95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.98 0A31.98 31.98 0 000 31.97a31.98 31.98 0 0031.98 31.98 31.98 31.98 0 0031.97-31.98A31.98 31.98 0 0031.98 0zm4.6 11.75c.69-.16.97.1.8.79v39.7h-5.14V18.12L21.91 21.9v-4.64l14.68-5.5z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
          <svg
            class="selected_icon"
            viewBox="0 0 62.13 62.13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.06 0A31.06 31.06 0 000 31.06a31.06 31.06 0 0031.06 31.07 31.06 31.06 0 0031.07-31.07A31.06 31.06 0 0031.06 0zm-.11 10.98c3.5 0 6.26.91 8.3 2.76 2.02 1.82 3.04 4.26 3.04 7.3 0 3.71-2.37 8.12-7.09 13.24L25.14 45.2h18.88v3.9H19.37v-3.44l13.02-14.46a30.62 30.62 0 003.98-5.33 8.87 8.87 0 001.12-4.25c0-1.97-.6-3.58-1.8-4.84a6.24 6.24 0 00-4.74-1.89c-2.38 0-4.24.68-5.56 2.04-1.31 1.35-1.96 3.22-1.96 5.63h-4.78c0-3.46 1.11-6.26 3.33-8.4 2.24-2.13 5.23-3.2 8.97-3.2z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
        </div>
        <div
          @click="$emit('colorMain', '#0cce6b', '#0BBD60')"
          @contextmenu="$emit('colorSecond', '#0cce6b')"
          class="rounded color-sub"
          style="background-color: #0cce6b;"
        >
          <svg
            class="selected_icon"
            viewBox="0 0 63.95 63.95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.98 0A31.98 31.98 0 000 31.97a31.98 31.98 0 0031.98 31.98 31.98 31.98 0 0031.97-31.98A31.98 31.98 0 0031.98 0zm4.6 11.75c.69-.16.97.1.8.79v39.7h-5.14V18.12L21.91 21.9v-4.64l14.68-5.5z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
          <svg
            class="selected_icon"
            viewBox="0 0 62.13 62.13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.06 0A31.06 31.06 0 000 31.06a31.06 31.06 0 0031.06 31.07 31.06 31.06 0 0031.07-31.07A31.06 31.06 0 0031.06 0zm-.11 10.98c3.5 0 6.26.91 8.3 2.76 2.02 1.82 3.04 4.26 3.04 7.3 0 3.71-2.37 8.12-7.09 13.24L25.14 45.2h18.88v3.9H19.37v-3.44l13.02-14.46a30.62 30.62 0 003.98-5.33 8.87 8.87 0 001.12-4.25c0-1.97-.6-3.58-1.8-4.84a6.24 6.24 0 00-4.74-1.89c-2.38 0-4.24.68-5.56 2.04-1.31 1.35-1.96 3.22-1.96 5.63h-4.78c0-3.46 1.11-6.26 3.33-8.4 2.24-2.13 5.23-3.2 8.97-3.2z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
        </div>
        <div
          @click="$emit('colorMain', '#d94a3f', '#CA4339')"
          @contextmenu="$emit('colorSecond', '#d94a3f')"
          class="rounded color-sub"
          style="background-color: #d94a3f;"
        >
          <svg
            class="selected_icon"
            viewBox="0 0 63.95 63.95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.98 0A31.98 31.98 0 000 31.97a31.98 31.98 0 0031.98 31.98 31.98 31.98 0 0031.97-31.98A31.98 31.98 0 0031.98 0zm4.6 11.75c.69-.16.97.1.8.79v39.7h-5.14V18.12L21.91 21.9v-4.64l14.68-5.5z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
          <svg
            class="selected_icon"
            viewBox="0 0 62.13 62.13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.06 0A31.06 31.06 0 000 31.06a31.06 31.06 0 0031.06 31.07 31.06 31.06 0 0031.07-31.07A31.06 31.06 0 0031.06 0zm-.11 10.98c3.5 0 6.26.91 8.3 2.76 2.02 1.82 3.04 4.26 3.04 7.3 0 3.71-2.37 8.12-7.09 13.24L25.14 45.2h18.88v3.9H19.37v-3.44l13.02-14.46a30.62 30.62 0 003.98-5.33 8.87 8.87 0 001.12-4.25c0-1.97-.6-3.58-1.8-4.84a6.24 6.24 0 00-4.74-1.89c-2.38 0-4.24.68-5.56 2.04-1.31 1.35-1.96 3.22-1.96 5.63h-4.78c0-3.46 1.11-6.26 3.33-8.4 2.24-2.13 5.23-3.2 8.97-3.2z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
        </div>
        <div
          class="rounded color-sub"
          style="background-image:  linear-gradient(to right,#ff006eff, #3300ebff);"
        >
          <svg
            class="selected_icon"
            viewBox="0 0 63.95 63.95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.98 0A31.98 31.98 0 000 31.97a31.98 31.98 0 0031.98 31.98 31.98 31.98 0 0031.97-31.98A31.98 31.98 0 0031.98 0zm4.6 11.75c.69-.16.97.1.8.79v39.7h-5.14V18.12L21.91 21.9v-4.64l14.68-5.5z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
          <svg
            class="selected_icon"
            viewBox="0 0 62.13 62.13"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.06 0A31.06 31.06 0 000 31.06a31.06 31.06 0 0031.06 31.07 31.06 31.06 0 0031.07-31.07A31.06 31.06 0 0031.06 0zm-.11 10.98c3.5 0 6.26.91 8.3 2.76 2.02 1.82 3.04 4.26 3.04 7.3 0 3.71-2.37 8.12-7.09 13.24L25.14 45.2h18.88v3.9H19.37v-3.44l13.02-14.46a30.62 30.62 0 003.98-5.33 8.87 8.87 0 001.12-4.25c0-1.97-.6-3.58-1.8-4.84a6.24 6.24 0 00-4.74-1.89c-2.38 0-4.24.68-5.56 2.04-1.31 1.35-1.96 3.22-1.96 5.63h-4.78c0-3.46 1.11-6.26 3.33-8.4 2.24-2.13 5.23-3.2 8.97-3.2z"
              fill="#ffffff"
              paint-order="stroke fill markers"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="options-el">
      <h1 class="options-header">Gameboard</h1>
      <div class="gameboard-grid">
        <svg
          class="gameboard-sub gameboard-sub-active"
          version="1.1"
          viewBox="0 0 41.962 64.924"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:cc="http://creativecommons.org/ns#"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        >
          <metadata>
            <rdf:RDF>
              <cc:Work rdf:about>
                <dc:format>image/svg+xml</dc:format>
                <dc:type
                  rdf:resource="http://purl.org/dc/dcmitype/StillImage"
                />
                <dc:title />
              </cc:Work>
            </rdf:RDF>
          </metadata>
          <g transform="translate(-81.129 -119.67)">
            <g transform="matrix(7.7082 0 0 7.7082 -1042 -1525.6)">
              <g transform="translate(1.068 -1.298)">
                <text
                  x="144.73906"
                  y="215.93147"
                  fill="#2e4052"
                  font-family="Roboto"
                  font-size="1.59px"
                  letter-spacing="0px"
                  stroke-width=".085177"
                  word-spacing="0px"
                  style="line-height:1.25"
                  xml:space="preserve"
                >
                  <tspan
                    x="144.73906"
                    y="215.93147"
                    fill="#2e4052"
                    stroke-width=".085177"
                  >
                    Normal
                  </tspan>
                </text>
                <g transform="translate(4.0524e-6 .086272)">
                  <g transform="translate(.10383 .72497)">
                    <g
                      transform="matrix(-1.3306 -.01893 .01893 -1.3306 497.02 346.05)"
                      :fill="colorMain"
                    >
                      <rect
                        transform="rotate(45)"
                        x="253.29"
                        y="-122.76"
                        width=".35512"
                        height="2.2231"
                        ry="0"
                        style="paint-order:markers fill stroke"
                      />
                      <rect
                        transform="rotate(135)"
                        x="-121.82"
                        y="-254.58"
                        width=".35512"
                        height="2.2231"
                        ry="0"
                        style="paint-order:markers fill stroke"
                      />
                    </g>
                    <ellipse
                      cx="148.65"
                      cy="216.99"
                      rx="1.0791"
                      ry="1.1252"
                      fill="none"
                      :stroke="colorSecond"
                      stroke-linejoin="round"
                      stroke-width=".32071"
                      style="paint-order:markers fill stroke"
                    />
                  </g>
                  <g transform="translate(0 -.23151)">
                    <g
                      transform="translate(-7.1828 .0028198)"
                      fill="none"
                      opacity=".517"
                      stroke="#183769"
                    >
                      <g stroke-width=".37194px">
                        <path d="m157.25 220.96-5.432-6e-3" opacity="1" />
                        <path d="m157.25 222.04-5.432-6e-3" opacity="1" />
                        <path d="m157.25 223.12-5.432-6e-3" opacity="1" />
                        <path d="m157.25 219.88-5.432-6e-3" opacity="1" />
                      </g>
                      <g stroke-width=".3031px">
                        <path d="m151.97 223.3 6e-3 -3.5849" opacity="1" />
                        <path d="m152.99 223.3 6e-3 -3.5849" opacity="1" />
                        <path d="m154.01 223.3 6e-3 -3.5849" opacity="1" />
                        <path d="m155.03 223.3 6e-3 -3.5849" opacity="1" />
                        <path d="m156.05 223.3 6e-3 -3.5849" opacity="1" />
                        <path d="m157.1 223.3 6e-3 -3.5849" opacity="1" />
                      </g>
                    </g>
                    <ellipse
                      cx="147.36"
                      cy="220.42"
                      rx=".27209"
                      ry=".28372"
                      fill="none"
                      :stroke="colorSecond"
                      stroke-linejoin="round"
                      stroke-width=".080866"
                      style="paint-order:markers fill stroke"
                    />
                    <g
                      transform="matrix(-.34979 -.0049763 .0049763 -.34979 238.64 254.34)"
                      :fill="colorMain"
                    >
                      <rect
                        transform="rotate(45)"
                        x="253.29"
                        y="-122.76"
                        width=".35512"
                        height="2.2231"
                        ry="0"
                        style="paint-order:markers fill stroke"
                      />
                      <rect
                        transform="rotate(135)"
                        x="-121.82"
                        y="-254.58"
                        width=".35512"
                        height="2.2231"
                        ry="0"
                        style="paint-order:markers fill stroke"
                      />
                    </g>
                    <ellipse
                      cx="148.37"
                      cy="222.58"
                      rx=".27209"
                      ry=".28372"
                      fill="none"
                      :stroke="colorSecond"
                      stroke-linejoin="round"
                      stroke-width=".080866"
                      style="paint-order:markers fill stroke"
                    />
                    <g
                      transform="matrix(-.34979 -.0049763 .0049763 -.34979 239.67 255.42)"
                      :fill="colorMain"
                    >
                      <rect
                        transform="rotate(45)"
                        x="253.29"
                        y="-122.76"
                        width=".35512"
                        height="2.2231"
                        ry="0"
                        style="paint-order:markers fill stroke"
                      />
                      <rect
                        transform="rotate(135)"
                        x="-121.82"
                        y="-254.58"
                        width=".35512"
                        height="2.2231"
                        ry="0"
                        style="paint-order:markers fill stroke"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <svg
          class="gameboard-sub"
          version="1.1"
          viewBox="0 0 42.635 65.667"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:cc="http://creativecommons.org/ns#"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        >
          <metadata>
            <rdf:RDF>
              <cc:Work rdf:about>
                <dc:format>image/svg+xml</dc:format>
                <dc:type
                  rdf:resource="http://purl.org/dc/dcmitype/StillImage"
                />
                <dc:title />
              </cc:Work>
            </rdf:RDF>
          </metadata>
          <g transform="translate(-80.844 -119.57)">
            <g transform="matrix(7.7082 0 0 7.7082 -1087.3 -1535.4)">
              <text
                x="151.7141"
                y="215.89146"
                fill="#2e4052"
                font-family="Roboto"
                font-size="1.59px"
                letter-spacing="0px"
                stroke-width=".085177"
                word-spacing="0px"
                style="line-height:1.25"
                xml:space="preserve"
              >
                <tspan
                  x="151.7141"
                  y="215.89146"
                  fill="#2e4052"
                  stroke-width=".085177"
                >
                  Classic
                </tspan>
              </text>
              <g transform="translate(-.18416 .062905)">
                <g transform="translate(.098289 .67869)">
                  <circle
                    cx="152.94"
                    cy="217.09"
                    r="1.3155"
                    fill="#2e4052"
                    style="paint-order:normal"
                  />
                  <circle
                    cx="155.79"
                    cy="217.09"
                    r="1.3155"
                    fill="#f1f1f1"
                    stroke="#2e4052"
                    stroke-linejoin="round"
                    stroke-width=".1"
                    style="paint-order:normal"
                  />
                </g>
                <g transform="translate(-.03187 -.14883)">
                  <g fill="none" opacity=".517" stroke="#183769">
                    <g stroke-width=".37194px">
                      <path d="m157.25 220.96-5.432-6e-3" opacity="1" />
                      <path d="m157.25 222.04-5.432-6e-3" opacity="1" />
                      <path d="m157.25 223.12-5.432-6e-3" opacity="1" />
                      <path d="m157.25 219.88-5.432-6e-3" opacity="1" />
                    </g>
                    <g stroke-width=".3031px">
                      <path d="m151.97 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m152.99 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m154.01 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m155.03 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m156.05 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m157.1 223.3 6e-3 -3.5849" opacity="1" />
                    </g>
                  </g>
                  <g>
                    <circle
                      cx="154.03"
                      cy="220.98"
                      r=".4151"
                      fill="#2e4052"
                      style="paint-order:normal"
                    />
                    <circle
                      cx="155.07"
                      cy="222.05"
                      r=".39175"
                      fill="#f1f1f1"
                      stroke="#2e4052"
                      stroke-linejoin="round"
                      stroke-width=".02978"
                      style="paint-order:normal"
                    />
                    <circle
                      cx="154.02"
                      cy="222.06"
                      r=".39175"
                      fill="#f1f1f1"
                      stroke="#2e4052"
                      stroke-linejoin="round"
                      stroke-width=".02978"
                      style="paint-order:normal"
                    />
                    <circle
                      cx="153.03"
                      cy="220.95"
                      r=".4151"
                      fill="#2e4052"
                      style="paint-order:normal"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <svg
          version="1.1"
          viewBox="0 0 42.366 66.27"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:cc="http://creativecommons.org/ns#"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          class="gameboard-sub"
        >
          <metadata>
            <rdf:RDF>
              <cc:Work rdf:about>
                <dc:format>image/svg+xml</dc:format>
                <dc:type
                  rdf:resource="http://purl.org/dc/dcmitype/StillImage"
                />
                <dc:title />
              </cc:Work>
            </rdf:RDF>
          </metadata>
          <g transform="translate(-81.183 -119.75)">
            <g transform="matrix(7.7082 0 0 7.7082 -1140.8 -1534.7)">
              <text
                x="158.5457"
                y="215.82132"
                fill="#2e4052"
                font-family="Roboto"
                font-size="1.59px"
                letter-spacing="0px"
                stroke-width=".085177"
                word-spacing="0px"
                style="line-height:1.25"
                xml:space="preserve"
              >
                <tspan
                  x="158.5457"
                  y="215.82132"
                  fill="#2e4052"
                  stroke-width=".085177"
                >
                  Modern
                </tspan>
              </text>
              <g transform="translate(-4.5817e-6 -.054871)">
                <g
                  transform="translate(.23435 .74751)"
                  stroke="#2e4052"
                  stroke-linejoin="round"
                >
                  <rect
                    x="158.35"
                    y="215.81"
                    width="2.5319"
                    height="2.5913"
                    :fill="colorMain"
                    stroke-width=".091177"
                    style="paint-order:normal"
                  />
                  <rect
                    x="161.2"
                    y="215.81"
                    width="2.554"
                    height="2.6139"
                    :fill="colorSecond"
                    stroke-width=".091972"
                    style="paint-order:normal"
                  />
                </g>
                <g transform="translate(.072726)">
                  <g
                    transform="translate(6.6665 -.023018)"
                    fill="none"
                    opacity=".517"
                    stroke="#183769"
                  >
                    <g stroke-width=".37194px">
                      <path d="m157.25 220.96-5.432-6e-3" opacity="1" />
                      <path d="m157.25 222.04-5.432-6e-3" opacity="1" />
                      <path d="m157.25 223.12-5.432-6e-3" opacity="1" />
                      <path d="m157.25 219.88-5.432-6e-3" opacity="1" />
                    </g>
                    <g stroke-width=".3031px">
                      <path d="m151.97 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m152.99 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m154.01 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m155.03 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m156.05 223.3 6e-3 -3.5849" opacity="1" />
                      <path d="m157.1 223.3 6e-3 -3.5849" opacity="1" />
                    </g>
                  </g>
                  <g>
                    <rect
                      x="159.81"
                      y="220.04"
                      width=".72085"
                      height=".72095"
                      :fill="colorMain"
                      style="paint-order:normal"
                    />
                    <rect
                      x="160.83"
                      y="220.04"
                      width=".72533"
                      height=".72331"
                      :fill="colorSecond"
                      style="paint-order:normal"
                    />
                    <rect
                      x="160.83"
                      y="221.11"
                      width=".72085"
                      height=".72095"
                      :fill="colorMain"
                      style="paint-order:normal"
                    />
                    <rect
                      x="161.85"
                      y="222.18"
                      width=".72533"
                      height=".72331"
                      :fill="colorSecond"
                      style="paint-order:normal"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <div class="options-el">
      <!-- <form style="text-align: center;">
        <label class="modernLabel" for="oldPass">Old password</label>
        <input class="modernInput" type="text" name="oldPass" id="oldPass" />
        <br />

        <label class="modernLabel" for="newPass">Change password</label>
        <input class="modernInput" type="text" name="newPass" id="newPass" />
        <br />

        <label class="modernLabel" for="confNewPass">Confirm password</label>
        <input class="modernInput" type="text" name="confNewPass" id="confNewPass" />
        <br />
        <br />
        <button class="modernSubmit">Change password</button>
      </form>-->
    </div>
    <div class="options-el">
      <!-- <form style="text-align: center;">
        <label class="modernLabel" for="mailPass">Password</label>
        <input class="modernInput" type="text" name="mailPass" id="mailPass" />
        <br />
        <label class="modernLabel" for="newMail">New email</label>
        <input class="modernInput" type="text" name="newMail" id="newMail" />
        <br />
        <br />
        <button class="modernSubmit">Change email</button>
      </form>-->
    </div>
  </div>
</template>
<script>
export default {
  name: "Settings",
  components: {},
  methods: {
    // Converting RGB to HEX
    RGBToHex(rgb) {
      // Choose correct separator
      let sep = rgb.indexOf(",") > -1 ? "," : " ";
      // Turn "rgb(r,g,b)" into [r,g,b]
      rgb = rgb
        .substr(4)
        .split(")")[0]
        .split(sep);

      let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

      if (r.length == 1) r = "0" + r;
      if (g.length == 1) g = "0" + g;
      if (b.length == 1) b = "0" + b;

      return "#" + r + g + b;
    },
  },
  props: ["logged", "username", "colorMain", "colorSecond", "colorMainDark"],
  mounted() {
    setTimeout(() => {
      document.querySelectorAll(".gameboard-sub").forEach((element) => {
        element.addEventListener("click", function() {
          document.querySelectorAll(".gameboard-sub-active").forEach((el) => {
            el.classList.remove("gameboard-sub-active");
          });
          element.classList.add("gameboard-sub-active");
        });
      });

      document.querySelectorAll(".color-sub").forEach((element) => {
        element.addEventListener("click", function() {
          document.querySelectorAll(".selected_icon_active").forEach((el) => {
            el.classList.remove("selected_icon_active");
          });
          element
            .querySelectorAll(".selected_icon")[0]
            .classList.add("selected_icon_active");
        });

        element.addEventListener("contextmenu", function(ev) {
          ev.preventDefault();
          document.querySelectorAll(".selected_icon_active2").forEach((el) => {
            el.classList.remove("selected_icon_active2");
          });
          element
            .querySelectorAll(".selected_icon")[1]
            .classList.add("selected_icon_active2");
        });
        let mainC = this.colorMain;
        let backC = this.RGBToHex(element.style.backgroundColor);
        let secondC = this.colorSecond;
        if (mainC == backC) {
          element.click();
        } else if (secondC == backC) {
          document
            .querySelectorAll(".selected_icon_active2")
            .forEach((element) => {
              element.classList.remove("selected_icon_active2");
            });
          element
            .querySelectorAll(".selected_icon")[1]
            .classList.add("selected_icon_active2");
        }
      });
    }, 100);
  },
};
</script>
<style scoped>
.options-header {
  font-weight: 800;
  color: #2e4052;
  font-size: 3em;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: calc(100vh - 4rem);
  position: absolute;
  bottom: 0;
  width: 100%;
}

.options-el {
  width: 100%;
  height: 100%;
  text-align: center;
}

.color-grid {
  margin-right: auto;
  margin-left: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 65%;
  height: 50%;
  column-gap: 0.5em;
  row-gap: 1em;
}

.color-sub {
  border: 5px solid white;
  text-align: left;
  user-select: none;
  -moz-user-select: none;
}
.color-sub-active {
  border-color: #2e4052;
}

.selected_icon {
  width: 20%;
  margin-left: 0.5em;
  margin-top: 0.5em;
  opacity: 0%;
  transition: all 0.2s;
}

.selected_icon_active {
  opacity: 1 !important;
}

.selected_icon_active2 {
  opacity: 1 !important;
}

.modernInput {
  border: none;
  border-bottom: 5px #e70064 solid;
}
.modernLabel {
  text-align: bottom;
}
.gameboard-grid {
  margin-right: auto;
  margin-left: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 60%;
  column-gap: 2em;
}
.gameboard-sub {
  cursor: pointer;
  transition: all 0.5s;
  border: 5px solid #2e4052;
  padding: 10px;
  border-radius: 15px;
  border-color: transparent;
}

.gameboard-sub-active {
  border-color: #2e4052;
}
.rounded {
  border-radius: 1rem;
}
</style>
