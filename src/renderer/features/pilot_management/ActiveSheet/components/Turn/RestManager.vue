<template>
  <div>
    <v-layout column fill-height>
      <div>
        <v-flex xs12 class="major-title text-xs-center" style="background: #33691E">
          <span>RESTING</span>
        </v-flex>
        <v-flex xs12 class="text-xs-center mt-3 mb-3">
          <span class="grey--text">
            REPAIR CAPACITY REMAINING:
            <b :style="`color: ${color.repcap.dark}`">
              {{ mech.CurrentRepairs }}
            </b>
          </span>
          <br />
          <span>
            <v-icon large v-for="n in mech.CurrentRepairs" :key="'rep_' + n">
              control_point
            </v-icon>
            <v-icon
              large
              color="grey darken-1"
              v-for="n in mech.RepairCapacity - mech.CurrentRepairs"
              :key="'repcap_' + n"
            >
              mdi-circle-outline
            </v-icon>
          </span>
        </v-flex>
        <v-flex xs12 class="text-xs-right">
          <span class="caption">
            {{ mech.Frame.Source }} {{ mech.Frame.Name }} DIAGNOSTICS COMPLETE
          </span>
          <v-progress-linear
            class="pa-0 mt-0 mb-2"
            :value="progress()"
            color="blue darken-3"
            background-color="red darken-4"
            height="10"
          />
        </v-flex>
        <v-flex xs12 class="text-xs-left">
          <span v-if="mech.CurrentHP === mech.MaxHP" class="minor-title grey--text">
            >:// HP NOMINAL
          </span>
          <v-layout v-else row wrap>
            <span class="minor-title orange--text">
              >:// WARNING: DAMAGE DETECTED
            </span>
            <v-flex class="mr-4 ml-2">
              <v-btn
                block
                light
                :color="color.hp.dark"
                @click="healHP"
                :disabled="!this.mech.CurrentRepairs"
              >
                Recover HP
              </v-btn>
            </v-flex>
            <v-flex class="text-xs-center" xs2>
              <v-icon large class="mt-2">control_point</v-icon>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 class="text-xs-left">
          <span v-if="mech.CurrentStructure === mech.MaxStructure" class="minor-title grey--text">
            >:// STRUCTURAL INTEGRITY NOMINAL
          </span>
          <v-layout v-else row wrap>
            <span class="minor-title red--text">
              >:// CRITICAL: STRUCTURE COMPROMISED
            </span>
            <v-flex class="mr-4 ml-2">
              <v-btn
                block
                :color="color.structure.dark"
                @click="healStructure"
                :disabled="
                  mech.Frame.Name.toLowerCase() === 'everest'
                    ? !mech.CurrentRepairs
                    : mech.CurrentRepairs < 2
                "
              >
                Repair Structure
              </v-btn>
            </v-flex>
            <v-flex xs2 class="text-xs-center" v-if="mech.Frame.Name.toLowerCase() === 'everest'">
              <v-icon large class="mt-2">control_point</v-icon>
            </v-flex>
            <v-flex xs2 class="text-xs-center" v-else>
              <v-icon large class="mt-2">control_point</v-icon>
              <v-icon large class="mt-2">control_point</v-icon>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 class="text-xs-left">
          <span v-if="mech.CurrentStress === mech.MaxStress" class="minor-title grey--text">
            >:// REACTOR STRESS NOMINAL
          </span>
          <v-layout v-else row wrap>
            <span class="minor-title red--text">
              >:// CRITICAL: REACTOR DAMAGED
            </span>
            <v-flex grow class="mr-4 ml-2">
              <v-btn
                block
                :color="color.stress.dark"
                @click="healStress"
                :disabled="this.mech.CurrentRepairs < 2"
              >
                Repair Reactor
              </v-btn>
            </v-flex>
            <v-flex xs2 class="text-xs-center">
              <v-icon large class="mt-2">control_point</v-icon>
              <v-icon large class="mt-2">control_point</v-icon>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 class="text-xs-left">
          <span v-if="!destroyedWeapons.length" class="minor-title grey--text">
            >:// ARMAMENT NOMINAL
          </span>
          <div v-else>
            <v-layout>
              <span class="minor-title red--text">
                >:// WARNING: ARMAMENT DAMAGED
              </span>
            </v-layout>
            <v-layout row v-for="w in destroyedWeapons" :key="w.ID">
              <v-flex class="mr-4">
                <v-btn
                  block
                  :color="color.weapon.dark"
                  @click="repairSystem(w)"
                  :disabled="!mech.CurrentRepairs"
                >
                  Repair {{ w.Name }}
                </v-btn>
              </v-flex>
              <v-flex xs2 class="text-xs-center">
                <v-icon large class="mt-2">control_point</v-icon>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
        <v-flex xs12 class="text-xs-left">
          <span v-if="!destroyedSystems.length" class="minor-title grey--text">
            >:// SYSTEMS NOMINAL
          </span>
          <div v-else>
            <v-layout>
              <span class="minor-title red--text">
                >:// WARNING: EQUIPMENT DAMAGED
              </span>
            </v-layout>
            <v-layout row v-for="s in destroyedSystems" :key="s.ID">
              <v-flex class="mr-4">
                <v-btn
                  block
                  color="teal darken-3"
                  @click="repairSystem(s)"
                  :disabled="!mech.CurrentRepairs"
                >
                  Repair {{ s.Name }}
                </v-btn>
              </v-flex>
              <v-flex xs2 class="text-xs-center">
                <v-icon large class="mt-2">control_point</v-icon>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </div>
    </v-layout>
    <v-divider class="ma-2" />
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn block color="amber darken-4" dark @click="startCombat">
          Enter Combat
        </v-btn>
      </v-flex>
      <!-- <v-flex xs12>
        <v-btn block color="green darken-4" dark @click="endMission">Complete Mission</v-btn>
      </v-flex>-->
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TickBar from '../../../components/UI/TickBar.vue'
import colors from '@/features/_shared/UI/CCColors'
import { MechEquipment } from '@/class'

function normalize(current, max): number {
  return current / max
}

export default Vue.extend({
  name: 'rest-manager',
  components: { TickBar },
  props: {
    mech: Object,
    loadout: Object,
  },
  data: () => ({
    rest: false,
  }),
  computed: {
    color() {
      return colors
    },
    destroyedWeapons() {
      return this.loadout.Weapons.filter(x => x.IsDestroyed)
    },
    destroyedSystems() {
      return this.loadout.Systems.filter(x => x.IsDestroyed)
    },
  },
  methods: {
    progress(): number {
      return (
        ((normalize(this.mech.CurrentHP, this.mech.MaxHP) +
          normalize(
            this.loadout.Weapons.length - this.destroyedWeapons.length,
            this.loadout.Weapons.length
          ) +
          normalize(
            this.loadout.Systems.length - this.destroyedSystems.length,
            this.loadout.Systems.length
          ) +
          normalize(this.mech.CurrentStructure, this.mech.MaxStructure) +
          normalize(this.mech.CurrentStress, this.mech.MaxStress)) /
          5) *
        100
      )
    },
    startRest() {
      this.rest = true
      const pilot = this.$store.getters.getPilot
      pilot.CurrentHP += Math.ceil(pilot.MaxHP / 2)
      this.mech.CurrentHeat = 0
      this.mech.Conditions.splice(0, this.mech.Conditions.length)
      this.mech.Statuses.splice(0, this.mech.Statuses.length)
    },
    healHP() {
      this.mech.CurrentHP = this.mech.MaxHP
      this.mech.CurrentRepairs -= 1
    },
    healStructure() {
      this.mech.CurrentStructure = this.mech.MaxStructure
      this.mech.CurrentRepairs -= this.mech.Frame.Name.toLowerCase() === 'everest' ? 1 : 2
    },
    healStress() {
      this.mech.CurrentStress = this.mech.MaxStress
      this.mech.CurrentRepairs -= 2
    },
    repairSystem(w: MechEquipment) {
      w.Repair()
      this.mech.CurrentRepairs -= 1
    },
    startCombat() {
      this.rest = false
      this.$emit('end')
    },
  },
})
</script>
