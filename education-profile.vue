<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="2">
      <v-app-bar-title class="text-h6 font-weight-medium">
        Education
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="bottom end"
        offset="8"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-menu-down"
            v-bind="props"
            size="small"
            variant="text"
            :aria-label="'Open profile menu'"
          >
          </v-btn>
        </template>

        <v-card min-width="320" max-width="400" class="elevation-8">
          <v-card-text class="pa-0">
            <!-- Populations Section -->
            <div class="pa-3 pb-2">
              <v-subheader class="text-subtitle-2 font-weight-bold text-primary px-0 mb-2">
                Populations
              </v-subheader>
              <v-row dense>
                <v-col
                  v-for="population in populations"
                  :key="population"
                  cols="6"
                  sm="4"
                >
                  <v-card
                    variant="outlined"
                    class="population-card"
                    :ripple="true"
                    @click="selectItem('Population', population)"
                    role="button"
                    :aria-label="`Select ${population} population`"
                    tabindex="0"
                    @keydown.enter="selectItem('Population', population)"
                    @keydown.space="selectItem('Population', population)"
                  >
                    <v-card-text class="pa-2 text-center">
                      <div class="text-caption font-weight-medium">
                        {{ population }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <v-divider></v-divider>

            <!-- Topics Section -->
            <div class="pa-3 pt-2">
              <v-subheader class="text-subtitle-2 font-weight-bold text-primary px-0 mb-2">
                Topics
              </v-subheader>
              <v-row dense>
                <v-col
                  v-for="topic in topics"
                  :key="topic"
                  cols="6"
                  sm="4"
                >
                  <v-card
                    variant="outlined"
                    class="topic-card"
                    :ripple="true"
                    @click="selectItem('Topic', topic)"
                    role="button"
                    :aria-label="`Select ${topic} topic`"
                    tabindex="0"
                    @keydown.enter="selectItem('Topic', topic)"
                    @keydown.space="selectItem('Topic', topic)"
                  >
                    <v-card-text class="pa-2 text-center">
                      <div class="text-caption font-weight-medium">
                        {{ topic }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="mt-4">
              <v-card-title class="text-h5">
                Education Profile
              </v-card-title>
              <v-card-text>
                <p class="text-body-1 mb-4">
                  Click the menu button in the header to explore different populations and topics.
                  Selected items will be logged to the console.
                </p>
                <v-alert
                  v-if="lastSelected"
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  <strong>Last Selected:</strong> {{ lastSelected.type }} - {{ lastSelected.item }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const menu = ref(false)
const lastSelected = ref(null)

const populations = [
  'Older Adults',
  'Working Poor',
  'Youth',
  'Hispanics and Latinos',
  'Asians',
  'African Americans'
]

const topics = [
  'Economic Mobility',
  'Basic Needs',
  'Food Access',
  'Community Development',
  'Health',
  'Crime and Safety',
  'Education',
  'Environment',
  'Equity',
  'Economy',
  'Poverty and Income',
  'Demographics'
]

const selectItem = (type, item) => {
  console.log(`Selected ${type}: ${item}`)
  lastSelected.value = { type, item }
  menu.value = false
}
</script>

<style scoped>
.population-card,
.topic-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-height: 60px;
  display: flex;
  align-items: center;
}

.population-card:hover,
.topic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.population-card:focus,
.topic-card:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.v-subheader {
  height: auto;
  min-height: unset;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .population-card,
  .topic-card {
    min-height: 50px;
  }
}
</style>
