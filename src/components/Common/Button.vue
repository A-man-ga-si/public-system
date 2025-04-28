<template>
    <button 
      :class="[
        'button-base',
        variantClasses,
        sizeClasses,
        { 'disabled': disabled }
      ]" 
      :disabled="disabled"
      @click="$emit('click')"
    >
      <span 
        v-if="icon && iconPosition === 'start'" 
        class="button-icon"
      >
        <component :is="icon"></component>
      </span>
      <slot></slot>
      <span 
        v-if="icon && iconPosition === 'end'" 
        class="button-icon"
      >
        <component :is="icon"></component>
      </span>
    </button>
  </template>
  
  <script>
  export default {
    name: 'Button',
    props: {
      variant: {
        type: String,
        default: 'primary',
        validator: (value) => {
          return ['primary', 'secondary', 'primary-outline', 'secondary-outline', 'link'].includes(value);
        }
      },
      size: {
        type: String,
        default: 'default',
        validator: (value) => {
          return ['sm', 'default', 'lg', 'icon'].includes(value);
        }
      },
      icon: {
        type: Object,
        default: null,
      },
      iconPosition: {
        type: String,
        default: 'start',
        validator: (value) => {
          return ['start', 'end'].includes(value);
        }
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    },
    computed: {
      variantClasses() {
        const variantMap = {
          'primary': 'button-primary',
          'secondary': 'button-secondary',
          'primary-outline': 'button-primary-outline',
          'secondary-outline': 'button-secondary-outline',
          'link': 'button-link'
        };
        
        return variantMap[this.variant] || 'button-primary';
      },
      sizeClasses() {
        const sizeMap = {
          'sm': 'button-sm',
          'default': 'button-default',
          'lg': 'button-lg',
          'icon': 'button-icon-only'
        };
        
        return sizeMap[this.size] || 'button-default';
      }
    }
  }
  </script>
  
  <style scoped>
  .button-base {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    border-radius: 50px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease-in-out;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .button-base:focus {
    outline: none;
  }
  
  .button-base:active {
    transform: scale(0.95);
  }
  
  .button-base:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* Variants */
  .button-primary {
    background-color: var(--color-rencanakan-sea-blue-300, #00365a);
    color: var(--color-rencanakan-pure-white, #ffffff);
    border: 1px solid var(--color-rencanakan-sea-blue-300, #00365a);
  }
  
  .button-primary:hover {
    background-color: var(--color-rencanakan-sea-blue-500, #001e31);
    border-color: var(--color-rencanakan-sea-blue-500, #001e31);
    transform: scale(1.02);
  }
  
  .button-primary:active {
    background-color: var(--color-rencanakan-sea-blue-500, #001e31);
  }
  
  .button-secondary {
    background-color: var(--color-rencanakan-premium-gold-300, #ff9933);
    color: var(--color-rencanakan-pure-white, #ffffff);
    border: 1px solid var(--color-rencanakan-premium-gold-300, #ff9933);
  }
  
  .button-secondary:hover {
    background-color: var(--color-rencanakan-premium-gold-400, #a45200);
    border-color: var(--color-rencanakan-premium-gold-400, #a45200);
    transform: scale(1.02);
  }
  
  .button-secondary:active {
    background-color: var(--color-rencanakan-premium-gold-400, #a45200);
    border-color: var(--color-rencanakan-premium-gold-400, #a45200);
  }
  
  .button-primary-outline {
    background-color: transparent;
    color: var(--color-rencanakan-sea-blue-300, #00365a);
    border: 1px solid var(--color-rencanakan-sea-blue-300, #00365a);
  }
  
  .button-primary-outline:hover {
    background-color: var(--color-rencanakan-sea-blue-300, #00365a);
    color: var(--color-rencanakan-pure-white, #ffffff);
    transform: scale(1.02);
  }
  
  .button-primary-outline:active {
    background-color: var(--color-rencanakan-sea-blue-500, #001e31);
    border-color: var(--color-rencanakan-sea-blue-500, #001e31);
    color: var(--color-rencanakan-pure-white, #ffffff);
  }
  
  .button-secondary-outline {
    background-color: transparent;
    color: var(--color-rencanakan-premium-gold-300, #ff9933);
    border: 1px solid var(--color-rencanakan-premium-gold-300, #ff9933);
  }
  
  .button-secondary-outline:hover {
    background-color: var(--color-rencanakan-premium-gold-300, #ff9933);
    color: var(--color-rencanakan-pure-white, #ffffff);
    transform: scale(1.02);
  }
  
  .button-secondary-outline:active {
    background-color: var(--color-rencanakan-premium-gold-400, #a45200);
    border-color: var(--color-rencanakan-premium-gold-400, #a45200);
    color: var(--color-rencanakan-pure-white, #ffffff);
  }
  
  .button-link {
    background-color: transparent;
    color: var(--color-rencanakan-sea-blue-300, #00365a);
    border: none;
    padding: 0;
  }
  
  .button-link:hover {
    color: var(--color-rencanakan-sea-blue-300, #00365a);
    text-decoration: underline;
    transform: none;
    box-shadow: none;
  }
  
  .button-link:active {
    color: var(--color-rencanakan-sea-blue-500, #001e31);
    transform: scale(0.98);
  }
  
  /* Sizes */
  .button-sm {
    height: 32px;
    padding: 7px 12px;
  }
  
  .button-default {
    height: 36px;
    padding: 9px 14px;
  }
  
  .button-lg {
    height: 40px;
    padding: 9px 16px;
  }
  
  .button-icon-only {
    height: 36px;
    width: 36px;
    padding: 9px;
  }
  
  /* Disabled state */
  .button-base[disabled], 
  .button-base.disabled {
    background-color: var(--color-rencanakan-base-gray, #d7d7d7);
    border-color: var(--color-rencanakan-base-gray, #d7d7d7);
    color: var(--color-rencanakan-pure-white, #ffffff);
    cursor: not-allowed;
  }
  
  .button-base[disabled]:hover, 
  .button-base.disabled:hover {
    transform: none;
    box-shadow: none;
  }
  
  .button-primary-outline[disabled],
  .button-primary-outline.disabled,
  .button-secondary-outline[disabled],
  .button-secondary-outline.disabled {
    background-color: transparent;
    border-color: var(--color-rencanakan-base-gray, #d7d7d7);
    color: var(--color-rencanakan-base-gray, #d7d7d7);
  }
  
  .button-link[disabled],
  .button-link.disabled {
    color: var(--color-rencanakan-base-gray, #d7d7d7);
    text-decoration: none;
  }
  
  /* Icon styling */
  .button-icon {
    display: inline-flex;
    height: 16px;
    width: 16px;
    align-items: center;
    justify-content: center;
  }
  
  /* Responsive adjustments */
  @media (min-width: 640px) {
    .button-sm {
      height: 36px;
      padding: 8px 16px;
    }
    
    .button-default {
      height: 40px;
      padding: 11px 20px;
    }
    
    .button-lg {
      height: 44px;
      padding: 13px 24px;
    }
    
    .button-icon-only {
      height: 40px;
      width: 40px;
      padding: 11px;
    }
    
    .button-icon {
      height: 20px;
      width: 20px;
    }
  }
  </style>