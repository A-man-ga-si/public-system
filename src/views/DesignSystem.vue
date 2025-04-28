<template>
  <div class="design-system-container">
    <h1 class="main-title">Design System</h1>
    
    <!-- Search Components Section -->
    <section class="component-section">
      <h2 class="section-title">Search Components</h2>
      
      <div class="component-demo">
        <h3 class="component-title">SearchBar</h3>
        <div class="component-description">
          <p>A reusable search input component with customizable placeholder.</p>
        </div>
        <div class="component-example">
          <SearchBar 
            v-model="searchQuery" 
            placeholder="Search for something..." 
            @search="performSearch"
          />
          <div class="component-result" v-if="hasSearched">
            <p>Search query: "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>

      <div class="component-demo">
        <h3 class="component-title">DropdownSelect</h3>
        <div class="component-description">
          <p>A customizable dropdown select component with focus styling and custom icon.</p>
        </div>
        <div class="component-example">
          <DropdownSelect
            v-model="selectedOption"
            :options="dropdownOptions"
            placeholder="Select an option..."
          />
        </div>
      </div>
    </section>

    <!-- Button Components Section -->
    <section class="component-section">
      <h2 class="section-title">Button Components</h2>
      
      <div class="component-demo">
        <h3 class="component-title">Button Variants</h3>
        <div class="component-description">
          <p>Different button style variants to use across the application.</p>
        </div>
        <div class="component-example">
          <div class="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="primary-outline">Primary Outline</Button>
            <Button variant="secondary-outline">Secondary Outline</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </div>
      </div>

      <div class="component-demo">
        <h3 class="component-title">Button Sizes</h3>
        <div class="component-description">
          <p>Buttons in different size variants.</p>
        </div>
        <div class="component-example">
          <div class="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary">Default</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
          <div class="flex flex-wrap items-center gap-4 mt-4">
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="secondary">Default</Button>
            <Button variant="secondary" size="lg">Large</Button>
          </div>
        </div>
      </div>

      <div class="component-demo">
        <h3 class="component-title">Buttons with Icons (Start Position)</h3>
        <div class="component-description">
          <p>Buttons with icons positioned at the start.</p>
        </div>
        <div class="component-example">
          <div class="flex flex-wrap gap-4">
            <Button variant="primary" :icon="IconLup">Search</Button>
            <Button variant="secondary" :icon="IconLup">Notifications</Button>
            <Button variant="primary-outline" :icon="IconLeftChevron">Back</Button>
            <Button variant="secondary-outline" :icon="IconLeftChevron">Previous</Button>
            <Button variant="link" :icon="IconLup">Search More</Button>
          </div>
        </div>
      </div>

      <div class="component-demo">
        <h3 class="component-title">Buttons with Icons (End Position)</h3>
        <div class="component-description">
          <p>Buttons with icons positioned at the end.</p>
        </div>
        <div class="component-example">
          <div class="flex flex-wrap gap-4">
            <Button variant="primary" :icon="IconRightChevron" iconPosition="end">Continue</Button>
            <Button variant="secondary" :icon="IconRightChevron" iconPosition="end">Next</Button>
            <Button variant="primary-outline" :icon="IconRightChevron" iconPosition="end">Next Step</Button>
            <Button variant="secondary-outline" :icon="IconRightChevron" iconPosition="end">Skip</Button>
            <Button variant="link" :icon="IconRightChevron" iconPosition="end">Learn More</Button>
          </div>
        </div>
      </div>

      <div class="component-demo">
        <h3 class="component-title">Icon-Only Buttons</h3>
        <div class="component-description">
          <p>Buttons that display only an icon.</p>
        </div>
        <div class="component-example">
          <div class="flex flex-wrap gap-4">
            <Button variant="primary" :icon="IconLup" size="icon" aria-label="Search"></Button>
            <Button variant="secondary" :icon="IconRightChevron" size="icon" aria-label="Next"></Button>
            <Button variant="primary-outline" :icon="IconLeftChevron" size="icon" aria-label="Back"></Button>
            <Button variant="secondary-outline" :icon="IconDownChevron" size="icon" aria-label="Down"></Button>
          </div>
        </div>
      </div>

      <div class="component-demo">
        <h3 class="component-title">Disabled Buttons</h3>
        <div class="component-description">
          <p>Buttons in their disabled state.</p>
        </div>
        <div class="component-example">
          <div class="flex flex-wrap gap-4">
            <Button variant="primary" disabled>Primary Disabled</Button>
            <Button variant="secondary" disabled>Secondary Disabled</Button>
            <Button variant="primary-outline" disabled>Outline Disabled</Button>
            <Button variant="secondary-outline" disabled>Secondary Outline Disabled</Button>
            <Button variant="link" disabled>Link Disabled</Button>
          </div>
        </div>
      </div>
      
      <div class="component-demo">
        <h3 class="component-title">Button Usage in Context</h3>
        <div class="component-description">
          <p>Examples of buttons used in a typical form or action context.</p>
        </div>
        <div class="component-example">
          <div class="flex flex-wrap justify-between">
            <div>
              <Button variant="primary-outline" :icon="IconLeftChevron">Previous</Button>
            </div>
            <div class="flex gap-2">
              <Button variant="secondary-outline">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SearchBar from '@/components/Common/SearchBar.vue'
import DropdownSelect from '@/components/Common/DropdownSelect.vue'
import Button from '@/components/Common/Button.vue'

// Import available icons
import IconLup from '@/assets/icons/IconLup.vue'
import IconRightChevron from '@/assets/icons/IconRightChevron.vue'
import IconLeftChevron from '@/assets/icons/IconLeftChevron.vue'
import IconDownChevron from '@/assets/icons/IconDownChevron.vue'

export default {
  name: 'DesignSystem',
  components: {
    SearchBar,
    DropdownSelect,
    Button
  },
  data() {
    return {
      searchQuery: '',
      hasSearched: false,
      selectedOption: '',
      dropdownOptions: ['Option 1', 'Option 2', 'Option 3'],
      // Make icons available in template
      IconLup,
      IconRightChevron,
      IconLeftChevron,
      IconDownChevron,
      // Click counter for demonstration
      clickCounter: 0
    }
  },
  methods: {
    performSearch() {
      this.hasSearched = true
      console.log('Searching for:', this.searchQuery)
    },
    incrementCounter() {
      this.clickCounter++
      console.log('Button clicked, counter:', this.clickCounter)
    }
  }
}
</script>

<style scoped>
/* your styles remain the same */
.design-system-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Roboto', sans-serif;
}

.main-title {
  font-size: 32px;
  margin-bottom: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.component-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.component-demo {
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.component-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.component-description {
  margin-bottom: 20px;
  color: #777;
}

.component-example {
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
}

.component-result {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f8ff;
  border-radius: 4px;
}

/* Utility classes */
.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-column {
  flex-direction: column;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
