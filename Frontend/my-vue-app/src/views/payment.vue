<template>

      <main class="payment-container">
        <h1 class="payment-title">Make Payment</h1>
  
        <form class="payment-form">
          <section class="form-section">
            <h2 class="section-label">Contact information</h2>
            <div class="email-input-container">
              <label for="email" class="email-label">Email</label>
              <input
                type="email"
                id="email"
                class="email-input"
                value="00Chukwudaniel@gmail.com"
              />
            </div>
          </section>
  
          <section class="form-section">
            <h2 class="section-label">Payment method</h2>
  
            <div class="card-info">
              <label class="card-label">Card information</label>
              <div class="card-input-group">
                <div class="card-number-container">
                  <input
                    type="text"
                    id="card-number"
                    class="card-number-input"
                    placeholder="Card number"
                  />
                  <div class="card-icons">
                    <div class="card-icon-wrapper">
                      <svg
                        class="card-icon mastercard"
                        width="24"
                        height="16"
                        viewBox="0 0 24 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22 0H2C0.89543 0 0 0.89543 0 2V14C0 15.1046 0.89543 16 2 16H22C23.1046 16 24 15.1046 24 14V2C24 0.89543 23.1046 0 22 0Z"
                          fill="#252525"
                        ></path>
                        <path
                          d="M9 13C11.7614 13 14 10.7614 14 8C14 5.23858 11.7614 3 9 3C6.23858 3 4 5.23858 4 8C4 10.7614 6.23858 13 9 13Z"
                          fill="#EB001B"
                        ></path>
                        <path
                          d="M15 13C17.7614 13 20 10.7614 20 8C20 5.23858 17.7614 3 15 3C12.2386 3 10 5.23858 10 8C10 10.7614 12.2386 13 15 13Z"
                          fill="#F79E1B"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12 3.99963C13.2144 4.91184 14 6.36418 14 8C14 9.63582 13.2144 11.0882 12 12.0004C10.7856 11.0882 10 9.63582 10 8C10 6.36418 10.7856 4.91184 12 3.99963V3.99963Z"
                          fill="#FF5F00"
                        ></path>
                      </svg>
                    </div>
                    <div class="card-icon-wrapper">
                      <svg
                        class="card-icon visa"
                        width="24"
                        height="16"
                        viewBox="0 0 24 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_72_339)">
                          <path
                            d="M21.75 0.25H2.25C1.14543 0.25 0.25 1.14543 0.25 2.25V13.75C0.25 14.8546 1.14543 15.75 2.25 15.75H21.75C22.8546 15.75 23.75 14.8546 23.75 13.75V2.25C23.75 1.14543 22.8546 0.25 21.75 0.25Z"
                            fill="white"
                            stroke="black"
                            stroke-opacity="0.2"
                            stroke-width="0.5"
                          ></path>
                          <path
                            d="M2.78773 5.91444C2.26459 5.62751 1.66754 5.39674 1 5.23659L1.028 5.11188H3.76498C4.13596 5.12489 4.43699 5.23651 4.53495 5.63071L5.12977 8.46659L5.31198 9.32073L6.97797 5.11188H8.77679L6.10288 11.2775H4.30397L2.78773 5.91444ZM10.1 11.2841H8.39883L9.46285 5.11188H11.1639L10.1 11.2841ZM16.2668 5.26277L16.0354 6.59559L15.8816 6.53004C15.5737 6.40525 15.1674 6.28054 14.6144 6.29371C13.9427 6.29371 13.6415 6.56277 13.6345 6.82546C13.6345 7.11441 13.9989 7.30484 14.5939 7.58725C15.574 8.02719 16.0286 8.56557 16.0218 9.26819C16.0081 10.5486 14.846 11.3761 13.0611 11.3761C12.2979 11.3694 11.5628 11.2181 11.1638 11.0476L11.4019 9.66205L11.6259 9.76066C12.1789 9.99071 12.5428 10.089 13.222 10.089C13.7118 10.089 14.2369 9.89838 14.2436 9.48488C14.2436 9.21565 14.0199 9.01851 13.3617 8.71646C12.7178 8.42087 11.8568 7.92848 11.8708 7.04198C11.8781 5.84042 13.0611 5 14.741 5C15.399 5 15.9312 5.13789 16.2668 5.26277ZM18.5278 9.09749H19.9417C19.8718 8.78889 19.5496 7.31147 19.5496 7.31147L19.4307 6.77964C19.3467 7.00943 19.1999 7.38373 19.2069 7.37056C19.2069 7.37056 18.6678 8.7429 18.5278 9.09749ZM20.6276 5.11188L22 11.284H20.4249C20.4249 11.284 20.2708 10.5748 20.2219 10.3581H18.0378C17.9746 10.5222 17.6808 11.284 17.6808 11.284H15.8958L18.4226 5.62399C18.5977 5.22342 18.906 5.11188 19.3118 5.11188H20.6276Z"
                            fill="#1434CB"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_72_339">
                            <rect width="24" height="16" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div class="card-icon-wrapper">
                      <svg
                        class="card-icon amex"
                        width="24"
                        height="16"
                        viewBox="0 0 24 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22 0H2C0.89543 0 0 0.89543 0 2V14C0 15.1046 0.89543 16 2 16H22C23.1046 16 24 15.1046 24 14V2C24 0.89543 23.1046 0 22 0Z"
                          fill="#016FD0"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M13.7642 13.3939V7.6925L23.9117 7.70161V9.27651L22.7388 10.5299L23.9117 11.7948V13.4031H22.0391L21.0439 12.3049L20.0558 13.4072L13.7642 13.3939Z"
                          fill="#FFFFFE"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.4419 12.7688V8.31995H18.2142V9.34483H15.6633V10.0405H18.1534V11.0483H15.6633V11.7317H18.2142V12.7688H14.4419Z"
                          fill="#016FD0"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M18.1952 12.7687L20.2825 10.5417L18.1951 8.31995H19.8107L21.0862 9.72998L22.3653 8.31995H23.9115V8.35495L21.8686 10.5417L23.9115 12.7056V12.7687H22.3498L21.0516 11.3446L19.7669 12.7687H18.1952Z"
                          fill="#016FD0"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.2374 2.63196H16.6834L17.5426 4.58281V2.63196H20.5624L21.0832 4.09353L21.6057 2.63196H23.9116V8.33335H11.7251L14.2374 2.63196Z"
                          fill="#FFFFFE"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.7006 3.25134L12.7266 7.69651H14.0805L14.4529 6.80635H16.4708L16.843 7.69651H18.2306L16.2648 3.25134H14.7006ZM14.8702 5.80878L15.4622 4.39371L16.0538 5.80878H14.8702Z"
                          fill="#016FD0"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M18.2122 7.69569V3.25061L20.1153 3.25715L21.0945 5.98988L22.0802 3.25061H23.9118V7.69569L22.7332 7.70612V4.65278L21.6206 7.69569H20.5448L19.4092 4.64235V7.69569H18.2122Z"
                          fill="#016FD0"
                        ></path>
                      </svg>
                    </div>
                    <div class="card-icon-wrapper">
                      <svg
                        class="card-icon discover"
                        width="24"
                        height="16"
                        viewBox="0 0 24 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.9972 15.7499L21.9994 15.7499C22.9545 15.7581 23.7381 14.9773 23.75 14.0042L23.75 2.0063C23.7462 1.53569 23.5589 1.08617 23.2297 0.756802C22.9014 0.428269 22.4589 0.246149 21.9972 0.250071L2.00064 0.250062C1.54109 0.246149 1.09858 0.428269 0.770279 0.756802C0.441145 1.08617 0.253838 1.53569 0.250008 2.00426L0.25 13.9937C0.253838 14.4643 0.441145 14.9138 0.770279 15.2432C1.09858 15.5717 1.54109 15.7538 2.00277 15.7499H21.9972ZM21.9962 16.2499C21.9958 16.2499 21.9955 16.2499 21.9951 16.2499L21.9972 16.2499H21.9962Z"
                          fill="white"
                          stroke="black"
                          stroke-opacity="0.2"
                          stroke-width="0.5"
                        ></path>
                        <path
                          d="M12.6123 15.9999H21.9971C22.5239 16.0043 23.0309 15.7993 23.4065 15.4299C23.7821 15.0605 23.9955 14.557 23.9999 14.0303V11.6716C20.4561 13.7059 16.6127 15.1668 12.6123 15.9999Z"
                          fill="#F27712"
                        ></path>
                        <path
                          d="M23.1725 9.29643H22.32L21.3601 8.03023H21.269V9.29643H20.5738V6.15161H21.6C22.4028 6.15161 22.8663 6.48264 22.8663 7.0785C22.8663 7.56678 22.5766 7.88126 22.0552 7.98057L23.1725 9.29643ZM22.1463 7.10333C22.1463 6.79712 21.9145 6.63988 21.4842 6.63988H21.269V7.59161H21.4676C21.9145 7.59161 22.1463 7.42609 22.1463 7.10333ZM18.1407 6.15161H20.1104V6.68126H18.8359V7.38471H20.0607V7.92264H18.8359V8.77505H20.1104V9.30471H18.1407V6.15161ZM15.9063 9.37919L14.4001 6.14333H15.1614L16.1132 8.26195L17.0732 6.14333H17.818L16.2952 9.37919H15.9228H15.9063ZM9.60833 9.37092C8.54902 9.37092 7.72143 8.65092 7.72143 7.71574C7.72143 6.8054 8.56557 6.06885 9.62488 6.06885C9.92281 6.06885 10.1711 6.12678 10.4773 6.25919V6.98747C10.2454 6.75965 9.9334 6.63187 9.60833 6.63161C8.94626 6.63161 8.44143 7.11161 8.44143 7.71574C8.44143 8.35299 8.93798 8.80816 9.64143 8.80816C9.95591 8.80816 10.1959 8.70885 10.4773 8.46057V9.18885C10.1628 9.32126 9.89798 9.37092 9.60833 9.37092ZM7.50626 8.33643C7.50626 8.94885 7.00143 9.37092 6.27315 9.37092C5.7435 9.37092 5.36281 9.18885 5.04005 8.77505L5.49522 8.38609C5.65246 8.66747 5.91729 8.80816 6.24833 8.80816C6.56281 8.80816 6.78626 8.61781 6.78626 8.36954C6.78626 8.22885 6.72005 8.12126 6.57936 8.0385C6.4251 7.96365 6.26446 7.90271 6.09936 7.85643C5.44557 7.64954 5.22212 7.42609 5.22212 6.98747C5.22212 6.47436 5.70212 6.0854 6.33109 6.0854C6.72833 6.0854 7.08419 6.20954 7.38212 6.44126L7.01798 6.85505C6.87366 6.69683 6.66938 6.60671 6.45522 6.60678C6.15729 6.60678 5.94212 6.75574 5.94212 6.95436C5.94212 7.11988 6.06626 7.21092 6.48005 7.35161C7.27453 7.59988 7.50626 7.83161 7.50626 8.34471V8.33643ZM4.08833 6.15161H4.7835V9.30471H4.08833V6.15161ZM1.85384 9.30471H0.827637V6.15161H1.85384C2.97936 6.15161 3.75729 6.79712 3.75729 7.72402C3.75729 8.19574 3.52557 8.64264 3.12005 8.94057C2.77246 9.18885 2.3835 9.30471 1.84557 9.30471H1.85384ZM2.66488 6.93781C2.43315 6.75574 2.16833 6.68954 1.71315 6.68954H1.52281V8.77505H1.71315C2.16005 8.77505 2.44143 8.6923 2.66488 8.52678C2.90488 8.32816 3.04557 8.03023 3.04557 7.72402C3.04557 7.41781 2.90488 7.12816 2.66488 6.93781Z"
                          fill="black"
                        ></path>
                        <path
                          d="M12.4137 6.06885C11.5034 6.06885 10.7585 6.79712 10.7585 7.69919C10.7585 8.65919 11.4703 9.37919 12.4137 9.37919C13.3406 9.37919 14.0689 8.65092 14.0689 7.72402C14.0689 6.79712 13.3489 6.06885 12.4137 6.06885Z"
                          fill="#F27712"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
  
                <div class="card-details">
                  <div class="expiry-container">
                    <input
                      type="text"
                      id="expiry"
                      class="expiry-input"
                      placeholder="MM / YY"
                    />
                  </div>
                  <div class="cvc-container">
                    <input
                      type="text"
                      id="cvc"
                      class="cvc-input"
                      placeholder="CVC"
                    />
                    <div class="cvc-icon-wrapper">
                      <svg
                        class="cvc-icon"
                        width="23"
                        height="17"
                        viewBox="0 0 23 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.2"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.337 1C13.6146 1.50713 13.025 2.18088 12.6182 2.9642C12.2114 3.74753 11.9993 4.61734 12 5.5C12 6.83 12.472 8.05 13.257 9H3C2.73478 9 2.48043 9.10536 2.29289 9.29289C2.10536 9.48043 2 9.73478 2 10V11C2 11.2652 2.10536 11.5196 2.29289 11.7071C2.48043 11.8946 2.73478 12 3 12H19C19.2652 12 19.5196 11.8946 19.7071 11.7071C19.8946 11.5196 20 11.2652 20 11V10.4C20.7976 9.99172 21.484 9.39559 22 8.663V15C22 15.5304 21.7893 16.0391 21.4142 16.4142C21.0391 16.7893 20.5304 17 20 17H2C1.46957 17 0.960859 16.7893 0.585786 16.4142C0.210714 16.0391 0 15.5304 0 15V3C0 2.46957 0.210714 1.96086 0.585786 1.58579C0.960859 1.21071 1.46957 1 2 1H14.337ZM21.044 1.293C21.283 1.495 21.504 1.717 21.706 1.956C21.5406 1.68594 21.3138 1.45877 21.044 1.293Z"
                          fill="#77787D"
                        ></path>
                        <path
                          opacity="0.4"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12.6 3C12.1267 3.92493 11.9262 4.96542 12.022 6H0V3H12.6Z"
                          fill="#77787D"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M17.5 11C16.0413 11 14.6424 10.4205 13.6109 9.38909C12.5795 8.35764 12 6.95869 12 5.5C12 4.04131 12.5795 2.64236 13.6109 1.61091C14.6424 0.579463 16.0413 0 17.5 0C18.9587 0 20.3576 0.579463 21.3891 1.61091C22.4205 2.64236 23 4.04131 23 5.5C23 6.95869 22.4205 8.35764 21.3891 9.38909C20.3576 10.4205 18.9587 11 17.5 11ZM15.316 3.221H14.695L13.179 3.991V4.777L14.381 4.149V7.779H15.324V3.22H15.316V3.221ZM17.123 3.85C17.571 3.85 17.885 4.101 17.885 4.463C17.885 4.856 17.515 5.131 16.981 5.131H16.746V5.799H17.029C17.594 5.799 17.979 6.081 17.979 6.49C17.979 6.883 17.602 7.15 17.068 7.15C16.675 7.15 16.282 7.024 15.874 6.78V7.566C16.314 7.755 16.754 7.857 17.186 7.857C18.215 7.857 18.922 7.331 18.922 6.569C18.922 6.034 18.592 5.602 18.042 5.429C18.514 5.272 18.82 4.856 18.82 4.384C18.82 3.646 18.168 3.143 17.225 3.143C16.7998 3.14762 16.38 3.23845 15.991 3.41V4.18C16.369 3.968 16.754 3.85 17.123 3.85V3.85ZM20.517 5.563C21.091 5.563 21.491 5.901 21.491 6.341C21.491 6.804 21.091 7.126 20.517 7.126C20.171 7.126 19.81 7.016 19.441 6.789V7.598C19.826 7.771 20.219 7.858 20.604 7.858C20.808 7.858 20.996 7.826 21.177 7.778C21.5971 7.09822 21.82 6.3151 21.821 5.516L21.806 5.186C21.5138 5.01277 21.1786 4.92543 20.839 4.934C20.6891 4.93346 20.5393 4.94415 20.391 4.966V3.944H21.523C21.4247 3.69245 21.3035 3.45044 21.161 3.221H19.574V5.696C19.8817 5.61331 20.1984 5.56864 20.517 5.563V5.563Z"
                          fill="#77787D"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="cardholder-info">
              <label class="cardholder-label">Cardholder name</label>
              <div class="cardholder-container">
                <input
                  type="text"
                  id="cardholder"
                  class="cardholder-input"
                  placeholder="Full name on card"
                />
              </div>
            </div>
  
            <div class="address-info">
              <label class="country-label">Country or region</label>
              <div class="country-select">
                <button type="button" class="select-button">
                  <span class="selected-value">Nigeria</span>
                  <svg
                    class="arrow-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.74547 4.30585C1.67757 4.37359 1.62369 4.45405 1.58693 4.54264C1.55017 4.63122 1.53125 4.72619 1.53125 4.8221C1.53125 4.91801 1.55017 5.01298 1.58693 5.10157C1.62369 5.19016 1.67757 5.27062 1.74547 5.33835L6.59297 10.1859C6.64694 10.2399 6.71104 10.2828 6.78161 10.3121C6.85217 10.3414 6.92782 10.3564 7.00422 10.3564C7.08062 10.3564 7.15627 10.3414 7.22683 10.3121C7.2974 10.2828 7.3615 10.2399 7.41547 10.1859L12.263 5.33835C12.5488 5.05252 12.5488 4.59169 12.263 4.30585C11.9771 4.02002 11.5163 4.02002 11.2305 4.30585L7.0013 8.52919L2.77214 4.30002C2.49214 4.02002 2.02547 4.02002 1.74547 4.30585Z"
                      fill="#666666"
                    ></path>
                  </svg>
                </button>
  
                <div class="address-container">
                  <input
                    type="text"
                    id="address1"
                    class="address-input"
                    placeholder="Address line 1"
                  />
                </div>
  
                <div class="address-container">
                  <input
                    type="text"
                    id="address2"
                    class="address-input"
                    placeholder="Address line 2"
                  />
                </div>
  
                <div class="address-container">
                  <input
                    type="text"
                    id="suburb"
                    class="address-input"
                    placeholder="Suburb"
                  />
                </div>
  
                <div class="city-postal">
                  <div class="city-container">
                    <input
                      type="text"
                      id="city"
                      class="city-input"
                      placeholder="City"
                    />
                  </div>
  
                  <div class="postal-container">
                    <input
                      type="text"
                      id="postal"
                      class="postal-input"
                      placeholder="Postal code"
                    />
                  </div>
                </div>
  
                <div class="state-select">
                  <button type="button" class="select-button">
                    <span class="placeholder-text">State</span>
                    <svg
                      class="arrow-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.74547 4.30585C1.67757 4.37359 1.62369 4.45405 1.58693 4.54264C1.55017 4.63122 1.53125 4.72619 1.53125 4.8221C1.53125 4.91801 1.55017 5.01298 1.58693 5.10157C1.62369 5.19016 1.67757 5.27062 1.74547 5.33835L6.59297 10.1859C6.64694 10.2399 6.71104 10.2828 6.78161 10.3121C6.85217 10.3414 6.92782 10.3564 7.00422 10.3564C7.08062 10.3564 7.15627 10.3414 7.22683 10.3121C7.2974 10.2828 7.3615 10.2399 7.41547 10.1859L12.263 5.33835C12.5488 5.05252 12.5488 4.59169 12.263 4.30585C11.9771 4.02002 11.5163 4.02002 11.2305 4.30585L7.0013 8.52919L2.77214 4.30002C2.49214 4.02002 2.02547 4.02002 1.74547 4.30585Z"
                        fill="#666666"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
  
          <section class="total-section">
            <div class="subtotal">
              <div class="label">Subtotal</div>
              <div class="amount">$998</div>
            </div>
  
            <div class="shipping">
              <div class="label">Shipping fee</div>
              <div class="amount">$20</div>
            </div>
  
            <div class="coupon">
              <div class="label">Coupon</div>
              <div class="amount">No</div>
            </div>
  
            <div class="divider-container">
              <hr class="divider" />
            </div>
  
            <div class="final-total">
              <div class="total-label">TOTAL</div>
              <div class="total-amount">$118</div>
            </div>
  
            <button type="submit" class="pay-button">
              <span class="pay-text">Pay</span>
            </button>
          </section>
        </form>
      </main>
    
  
  </template>

<script>
export default {
  name: "payment",
};
</script>
  
  <style scoped>

    /* Base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  
}

body {
  font-family: "Inter", sans-serif;
  background-color: #fff;
  color: #333;
  
}

/* Payment container */
.payment-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Inter", sans-serif;
  
}

/* Payment title */
.payment-title {
  color: #40bfff;
  font-family: "Raleway", sans-serif;
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
}

/* Payment form */
.payment-form {
  max-width: 840px;
  margin: 0 auto;
  padding: 52px 0;
}

/* Form sections */
.form-section {
  margin-bottom: 36px;
}

.section-label {
  color: #666;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

/* Email input */
.email-input-container {
  display: flex;
  padding: 12px;
  border: 0.8px solid #e7eaeb;
  border-radius: 7px;
  background-color: #f7f7f7;
  align-items: center;
}

.email-label {
  color: #4d4d4d;
  font-size: 14px;
  margin-right: 10px;
}

.email-input {
  flex: 1;
  border: none;
  background: transparent;
  color: #333;
  font-size: 14px;
  text-align: center;
  outline: none;
  font-family: "Inter", sans-serif;
}

/* Card information */
.card-info {
  margin-top: 30px;
}

.card-label,
.cardholder-label,
.country-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.card-input-group {
  display: flex;
  flex-direction: column;
}

.card-number-container {
  display: flex;
  height: 34px;
  align-items: center;
  border: 0.8px solid #e7eaeb;
  border-radius: 7px 7px 0 0;
  background-color: #fff;
}

.card-number-input {
  flex: 1;
  height: 100%;
  padding: 9px 15px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: "Inter", sans-serif;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
}

.card-icons {
  display: flex;
  gap: 3px;
}

.card-icon-wrapper {
  display: flex;
  align-items: center;
}

/* Card details */
.card-details {
  display: flex;
}

.expiry-container {
  flex: 1;
  height: 34px;
  border: 0.8px solid #e7eaeb;
  border-radius: 0 0 0 7px;
  background-color: #fff;
}

.expiry-input {
  width: 100%;
  height: 100%;
  padding: 9px 15px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: "Inter", sans-serif;
}

.cvc-container {
  flex: 1;
  display: flex;
  height: 34px;
  align-items: center;
  border: 0.8px solid #e7eaeb;
  border-radius: 0 0 7px 0;
  background-color: #fff;
}

.cvc-input {
  flex: 1;
  height: 100%;
  padding: 9px 15px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: "Inter", sans-serif;
}

.cvc-icon-wrapper {
  margin-left: auto;
}

/* Cardholder information */
.cardholder-info {
  margin-top: 25px;
}

.cardholder-container {
  height: 34px;
  border: 0.8px solid #e7eaeb;
  border-radius: 7px;
  background-color: #fff;
}

.cardholder-input {
  width: 100%;
  height: 100%;
  padding: 9px 15px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: "Inter", sans-serif;
}

/* Address information */
.address-info {
  margin-top: 25px;
}

.select-button {
  display: flex;
  height: 34px;
  padding: 7px 15px;
  align-items: center;
  justify-content: space-between;
  border: 0.8px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  width: 100%;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  text-align: left;
}

.arrow-icon {
  transform: rotate(-90deg);
}

.address-container {
  height: 34px;
  border: 0.8px solid #e7eaeb;
  border-radius: 7px;
  background-color: #fff;
  margin-top: 10px;
}

.address-input {
  width: 100%;
  height: 100%;
  padding: 9px 15px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: "Inter", sans-serif;
}

.city-postal {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.city-container,
.postal-container {
  flex: 1;
  height: 34px;
  border: 0.8px solid #e7eaeb;
  border-radius: 7px;
  background-color: #fff;
}

.city-input,
.postal-input {
  width: 100%;
  height: 100%;
  padding: 9px 15px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: "Inter", sans-serif;
}

.state-select {
  margin-top: 10px;
}

/* Total section */
.total-section {
  max-width: 377px;
  margin-left: auto;
}

.subtotal,
.shipping,
.coupon {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #262626;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
}

.divider-container {
  margin: 20px 0;
}

.divider {
  height: 2px;
  background-color: #f6f7f8;
  border: none;
}

.final-total {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  font-family: "Poppins", sans-serif;
  font-size: 30px;
  color: #22262a;
}

.pay-button {
  width: 100%;
  height: 60px;
  background-color: #33a0ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-text {
  color: white;
}

/* Responsive styles */
@media (max-width: 991px) {
  .payment-container {
    padding: 15px;
  }

  .payment-form {
    padding: 30px 0;
  }

  .total-section {
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .payment-title {
    font-size: 24px;
  }

  .card-details {
    flex-direction: column;
  }

  .expiry-input {
    border-radius: 0;
  }

  .cvc-input {
    border-radius: 0 0 7px 7px;
    margin-top: -1px;
  }

  .city-postal {
    flex-direction: column;
  }

  .city-input {
    margin-bottom: 10px;
  }

  .total-section {
    max-width: 100%;
  }
}


    
  </style>