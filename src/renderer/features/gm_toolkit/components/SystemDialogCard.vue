<template>
  <v-card>
    <v-card-title
      class="headline d-flex grow-shrink-0"
      :class="`system--${system.type} white--text text-uppercase`"
    >
      <v-icon dark left>{{ icon }}</v-icon>
      {{ system.name }}
      <div class="caption ml-2 mr-2 mt-2 text-uppercase">
        <span v-if="system.type === 'weapon'">{{ system.weapon_type.join(' ') }}</span>
        <span v-else-if="system.action">{{ actionName(system.action) }}</span>
      </div>
      <v-btn outline color="white" v-ripple="false" style="pointer: default!important" round>
        {{ system.class }}
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-layout justify-space-around grow-shrink-0 v-if="system.type === 'weapon'">
        <v-flex>
          <v-chip outline label color="primary">
            <v-icon left>mdi-dice-multiple</v-icon>
            {{ printRoll(system.weapon_roll, system.smart, npc) }}
          </v-chip>
        </v-flex>
        <v-flex>
          <v-chip outline label color="primary">
            <v-icon left>mdi-vector-line</v-icon>
            {{ printRange(system.weapon_range) }}
          </v-chip>
        </v-flex>
        <v-flex v-if="system.damage">
          <v-chip outline label color="primary">
            <v-icon left>mdi-flare</v-icon>
            {{ printDamage(system.damage) }}
          </v-chip>
        </v-flex>
      </v-layout>
      <p v-if="system.effect" class="my-2">{{ system.effect }}</p>
      <template v-if="system.tags || system.recharge">
        <div>
          <v-chip dark color="primary" small v-for="tag in system.tags" :key="tag.name">
            {{ renderTag(tag, npc && npc.tier) }}
          </v-chip>
          <v-chip dark color="primary" small v-if="system.recharge" key="recharge">
            Recharge&nbsp;
            <b>{{ system.recharge }}</b>
          </v-chip>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { NPCSystem } from '../logic/interfaces/NPCSystem'
import NPC from '../logic/NPC'
import renderTag from '../logic/rendertag'
import _ from 'lodash'

export default Vue.extend({
  name: 'system-dialog-card',
  props: {
    system: Object,
    npc: NPC,
  },
  computed: {
    icon(): string {
      switch (this.system.type) {
        case 'system':
          return 'mdi-settings'
          break
        case 'trait':
          return 'mdi-account-circle'
          break
        case 'weapon':
          return 'mdi-sword-cross'
          break
      }
    },
  },
  methods: {
    renderTag,

    actionName(s: string): string {
      const map = {
        free: 'Free Action',
        quick: 'Quick Action',
        full: 'Full Action',
        protocol: 'Protocol',
        reaction: 'Reaction',
        quicktech: 'Quick Tech',
        fulltech: 'Full Tech',
      } as any
      return map[s]
    },

    printRoll(rollObj: NPCSystem.Roll, tech: boolean) {
      const npc = this.npc
      const { flat, accdiff } = rollObj
      let output = ''
      if (flat) {
        if (flat.val > -1) output += '+'
        let flatNum: number
        if (npc && flat.pertier) flatNum = Math.abs(flat.val) * (npc.tier + 1)
        else flatNum = Math.abs(flat.val)
        output += flatNum
      } else {
        output += '0'
      }
      output += tech ? ' vs e-defense' : ' vs evasion'
      if (flat && !npc && flat.pertier) {
        output += '/tier'
      }
      if (accdiff) {
        const word = accdiff.val > -1 ? 'Accuracy' : 'Difficulty'
        let accdifNum: number
        if (npc && accdiff.pertier) accdifNum = Math.abs(accdiff.val) * (npc.tier + 1)
        else accdifNum = Math.abs(accdiff.val)
        output += ` with +${accdifNum} ${word}`
        if (!npc && accdiff.pertier) {
          output += '/tier'
        }
      }
      return output
      console.log(output, npc)
    },

    printDamage(damageAry: { val: [number, number, number]; type: string }[]) {
      if (this.npc) {
        return damageAry
          .map(damageObj => `${damageObj.val[this.npc.tier]} ${_.capitalize(damageObj.type)}`)
          .join(', ')
      } else {
        return damageAry
          .map(damageObj => `${damageObj.val.join('/')} ${damageObj.type}`)
          .join(' + ')
      }
    },

    printRange(rangeAry: { val: number; type: string }[]) {
      return rangeAry.map(r => `${_.capitalize(r.type)} ${r.val}`).join(' ')
    },
  },
})
</script>
