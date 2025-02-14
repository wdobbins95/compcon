<template>
  <div class="roster-content">
    <div v-if="pilot.Name">
      <v-container fluid>
        <!-- Pilot Info Block -->
        <v-layout>
          <v-flex xs10>
            <v-layout align-end>
              <!-- Callsign -->
              <v-flex shrink>
                <editable-label
                  attr="callsign"
                  description="Callsign"
                  :pilot="pilot"
                  :placeholder="pilot.Callsign"
                >
                  <span slot="label" class="callsign-text">
                    {{ pilot.Callsign }}
                  </span>
                </editable-label>
              </v-flex>
              <!-- Name -->
              <v-flex>
                <editable-label
                  attr="name"
                  description="Name"
                  :placeholder="pilot.Name"
                  :pilot="pilot"
                >
                  <span slot="label" class="blockquote ml-1 pl-0">{{ pilot.Name }}&nbsp;</span>
                </editable-label>
              </v-flex>
              <v-spacer />
            </v-layout>
            <v-divider class="ma-2" />
            <!-- Pilot Statblock -->
            <v-layout>
              <v-flex>
                <pip-bar
                  small
                  :model="pilot.MaxHP"
                  :items="[pilot.MaxHP]"
                  :caption="`HP ${pilot.MaxHP}`"
                />
              </v-flex>
              <pip-bar
                small
                :model="pilot.Armor"
                :items="[pilot.Armor]"
                :caption="`ARMOR ${pilot.Armor}`"
              />
              <pip-bar
                small
                :model="pilot.EDefense"
                :items="[pilot.EDefense]"
                :caption="`E-DEFENSE ${pilot.EDefense}`"
              />
              <pip-bar
                small
                :model="pilot.Evasion"
                :items="[pilot.Evasion]"
                :caption="`EVASION ${pilot.Evasion}`"
              />
              <pip-bar
                small
                :model="pilot.Speed"
                :items="[pilot.Speed]"
                :caption="`SPEED ${pilot.Speed}`"
              />
            </v-layout>
          </v-flex>
          <!-- License Level -->
          <v-flex shrink>
            <span class="caption float-right">LICENSE LEVEL</span>
            <br />
          </v-flex>
          <span class="xl-text">{{ pilot.Level }}</span>
          <v-flex shrink>
            <!-- Level Up Button -->
            <v-tooltip bottom nudge-right="15px">
              <v-btn
                :to="'/level'"
                slot="activator"
                bottom
                right
                fab
                small
                :disabled="pilot.Level === maxLevel"
                color="primary"
                style="float:right; margin-left:30px"
              >
                <v-icon large>arrow_upward</v-icon>
              </v-btn>
              <span>Level Up</span>
            </v-tooltip>
            <!-- Level Selector -->
            <lazy-dialog
              :model="levelEditor"
              title="Set Pilot Level"
              acceptString="Set Pilot Level"
              hide-confirm
              @activate="levelEditor = true"
              @cancel="levelEditor = false"
            >
              <v-tooltip slot="activator" bottom nudge-right="15px">
                <v-btn
                  slot="activator"
                  @click="levelEditor = true"
                  outline
                  relative
                  icon
                  small
                  color="grey"
                  style="left: 10px; bottom: 20px"
                >
                  <v-icon small>build</v-icon>
                </v-btn>
                <span>Set Pilot Level</span>
              </v-tooltip>
              <template v-slot:modal-content>
                <level-selector
                  :pilot="pilot"
                  @changed="
                    levelEditor = false
                    notify(`Pilot Level set to ${$event}`)
                  "
                />
              </template>
            </lazy-dialog>
          </v-flex>
        </v-layout>
        <!-- End Pilot Info Block -->

        <!-- Bio/Apparance Block -->
        <v-layout>
          <v-flex xs8>
            <v-layout>
              <v-flex>
                <!-- Biograpgy -->
                <v-layout class="header" align-content-space-around>
                  <span>Biography</span>
                </v-layout>
                <v-layout>
                  <v-flex xs12 class="text-xs-center">
                    <b v-if="pilot.custom_background" class="minor-title">
                      {{ pilot.custom_background }}
                    </b>
                    <div v-else style="display: inline">
                      <span v-if="pilot.Background.err" class="grey--text">
                        // MISSING BACKGROUND DATA //
                      </span>
                      <b v-else class="minor-title">
                        {{ pilot.Background.Name }}
                      </b>
                    </div>
                    <v-tooltip right class="mlneg">
                      <span slot="activator">
                        <pilot-edit-modal
                          title="Select Pilot Background"
                          :modelRef="backgroundModal"
                          ref="backgroundSelector"
                        >
                          <background-selector
                            slot="modal-content"
                            @close="setBackground()"
                            :pilot="pilot"
                          />
                        </pilot-edit-modal>
                      </span>
                      <span>Change Pilot Background</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <!-- Clone Quirk -->
                <v-layout v-if="pilot.quirk">
                  <v-flex class="text-xs-center">
                    <v-alert :value="true" color="amber darken-4" class="ma-2">
                      <b class="minor-title">Clone Quirk</b>
                      <editable-label
                        :description="'Clone Quirk'"
                        :attr="'quirk'"
                        :placeholder="pilot.quirk"
                        :pilot="pilot"
                      >
                        <span slot="label" class="p fluff-text">{{ pilot.quirk }}&emsp;</span>
                      </editable-label>
                      <v-tooltip top>
                        <v-btn
                          absolute
                          top
                          right
                          slot="activator"
                          icon
                          class="mt-4"
                          @click="pilot.quirk = ''"
                        >
                          <v-icon color="white">close</v-icon>
                        </v-btn>
                        <span>Remove Quirk</span>
                      </v-tooltip>
                    </v-alert>
                  </v-flex>
                </v-layout>
                <!-- Pilot History -->
                <v-textarea
                  color="primary"
                  v-model="pilot.History"
                  auto-grow
                  rows="1"
                  label="Pilot History"
                  class="pl-3 pr-3"
                />
              </v-flex>
            </v-layout>
            <!-- Pilot Notes -->
            <v-layout>
              <v-flex>
                <div class="pt-1 pb-1 pl-3 pr-3">
                  <v-textarea
                    color="primary"
                    v-model="pilot.Notes"
                    auto-grow
                    outline
                    rows="1"
                    label="Notes"
                  />
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4>
            <!-- Appearance -->
            <v-layout class="header" align-content-space-around>
              <v-flex>
                <span>Appearance</span>
              </v-flex>
              <v-flex shrink>
                <v-tooltip left>
                  <span slot="activator">
                    <pilot-edit-modal
                      title="Set Pilot Portrait"
                      :modelRef="appearanceModal"
                      ref="appearanceSelector"
                    >
                      <image-selector
                        slot="modal-content"
                        :pilot="pilot"
                        @notify="notify"
                        @close="closePortrait"
                      />
                    </pilot-edit-modal>
                  </span>
                  <span>Change Pilot Portrait</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="pl-2" @click="appearanceModal = true">
                <div v-if="pilot.Portrait">
                  <v-img :src="pilot.Portrait" max-height="55vh" max-width="45.1vw" contain />
                </div>
                <div v-else>
                  <v-btn block small flat color="primary lighten-1">
                    <v-icon small>add</v-icon>
                    &nbsp;Add Pilot Image
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="pl-2">
                <v-textarea
                  color="primary"
                  v-model="pilot.TextAppearance"
                  auto-grow
                  rows="1"
                  label="Description"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <!-- End Bio/Apparance Block -->

        <!-- Downtime -->
        <v-layout class="header" align-content-space-around>
          <v-flex>
            <span>Downtime Reserves</span>
          </v-flex>
          <v-flex shrink>
            <v-tooltip left>
              <span slot="activator">
                <pilot-edit-modal
                  title="Add Downtime Reserve"
                  :modelRef="downtimeModal"
                  ref="downtimeSelector"
                >
                  <downtime-selector
                    slot="modal-content"
                    :pilot="pilot"
                    @notify="notify"
                    @close="closeDowntime"
                  />
                </pilot-edit-modal>
              </span>
              <span>Add Downtime Reserve</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-layout row wrap justify-center>
          <v-container fluid grid-list-sm fill-height>
            <v-layout row wrap fill-height>
              <reserve
                v-for="(r, i) in pilot.Reserves"
                :key="`dtr_${i}`"
                :reserve="r"
                @remove="pilot.Reserves.splice(i, 1)"
              />
            </v-layout>
          </v-container>
        </v-layout>
        <!-- End Downtime -->

        <!-- Skills Block -->
        <v-layout>
          <v-flex xs1>
            <!-- Grit -->
            <v-layout class="header" justify-space-around>
              <span>Grit</span>
            </v-layout>
            <v-layout align-center justify-center column fill-height>
              <v-flex>
                <span class="display-3 font-weight-black text-xs-center">+{{ pilot.Grit }}</span>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs11>
            <!-- Triggers -->
            <v-layout class="header" justify-space-around>
              <v-flex>
                <span>Skill Triggers</span>
              </v-flex>
              <v-flex shrink>
                <v-tooltip left>
                  <v-chip
                    :outline="!pilot.IsMissingSkills"
                    small
                    slot="activator"
                    :color="pilot.IsMissingSkills ? 'warning' : ''"
                  >
                    {{ pilot.CurrentSkillPoints }}/{{ pilot.MaxSkillPoints }}
                  </v-chip>
                  <div>
                    <span>
                      {{ pilot.MaxSkillPoints - pilot.CurrentSkillPoints }}
                      Skill Trigger bonuses remaining
                    </span>
                  </div>
                </v-tooltip>
                <v-tooltip left>
                  <span slot="activator">
                    <pilot-edit-modal
                      title="Edit Pilot Skill Triggers"
                      :modelRef="skillModal"
                      :highlight="pilot.IsMissingSkills"
                    >
                      <skill-selector
                        slot="modal-content"
                        :pilot="pilot"
                        @close="skillModal = false"
                      />
                    </pilot-edit-modal>
                  </span>
                  <span>Edit Pilot Skill Triggers</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3">
                <skill-item
                  v-for="pilotskill in pilot.Skills"
                  :key="pilotskill.Skill.ID"
                  :pilotSkill="pilotskill"
                  :skill="pilotskill.Skill"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <!-- License Block -->
        <v-layout class="header" justify-space-around>
          <v-flex>
            <span>Licenses</span>
          </v-flex>
          <v-flex shrink>
            <v-tooltip left>
              <v-chip
                :outline="!pilot.IsMissingLicenses"
                small
                slot="activator"
                :color="pilot.IsMissingLicenses ? 'warning' : ''"
              >
                {{ pilot.CurrentLicensePoints }}/{{ pilot.MaxLicensePoints }}
              </v-chip>
              <div>
                <span>
                  {{ pilot.MaxLicensePoints - pilot.CurrentLicensePoints }}
                  License levels remaining
                </span>
              </div>
            </v-tooltip>
            <v-tooltip left>
              <span slot="activator">
                <pilot-edit-modal
                  title="Edit Pilot Licenses"
                  :modelRef="licenseModal"
                  ref="licenseSelector"
                  :highlight="pilot.IsMissingLicenses"
                >
                  <license-selector slot="modal-content" :pilot="pilot" />
                </pilot-edit-modal>
              </span>
              <span>Edit Pilot Licenses</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-layout class="ml-3 mr-3">
          <v-flex>
            <v-expansion-panel focusable>
              <license-item
                v-for="pLicense in pilot.Licenses"
                :key="pLicense.License.Name"
                :pilotRank="pLicense.Rank"
                :licenseData="pLicense.License"
              />
            </v-expansion-panel>
          </v-flex>
        </v-layout>

        <!-- Talent Block -->
        <v-layout class="header" justify-space-around>
          <v-flex>
            <span>Talents</span>
          </v-flex>
          <v-flex shrink>
            <v-tooltip left>
              <v-chip
                :outline="!pilot.IsMissingTalents"
                small
                slot="activator"
                :color="pilot.IsMissingTalents ? 'warning' : ''"
              >
                {{ pilot.CurrentTalentPoints }}/{{ pilot.MaxTalentPoints }}
              </v-chip>
              <div>
                <span>
                  {{ pilot.MaxTalentPoints - pilot.CurrentTalentPoints }}
                  Talent ranks remaining
                </span>
              </div>
            </v-tooltip>
            <v-tooltip left>
              <span slot="activator">
                <pilot-edit-modal
                  title="Edit Pilot Talents"
                  :modelRef="talentModal"
                  ref="talentSelector"
                  :highlight="pilot.IsMissingTalents"
                >
                  <talent-selector slot="modal-content" :pilot="pilot" @close="setPilotTalents" />
                </pilot-edit-modal>
              </span>
              <span>Edit Pilot Talents</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-layout class="ml-3 mr-3">
          <v-flex>
            <v-expansion-panel focusable>
              <talent-item
                v-for="pilotTalent in pilot.Talents"
                :key="pilotTalent.Talent.id"
                :pilotTalent="pilotTalent"
                :talent="pilotTalent.Talent"
              />
            </v-expansion-panel>
          </v-flex>
        </v-layout>

        <!-- Mech Skills Block -->
        <v-layout class="header" justify-space-around>
          <v-flex>
            <span>Mech Skills</span>
          </v-flex>
          <v-flex shrink>
            <v-tooltip left>
              <v-chip
                :outline="!pilot.IsMissingHASE"
                small
                slot="activator"
                :color="pilot.IsMissingHASE ? 'warning' : ''"
              >
                {{ pilot.CurrentHASEPoints }}/{{ pilot.MaxHASEPoints }}
              </v-chip>
              <div>
                <span>
                  {{ pilot.MaxHASEPoints - pilot.CurrentHASEPoints }}
                  Mech Skill points remaining
                </span>
              </div>
            </v-tooltip>
            <v-tooltip left>
              <span slot="activator">
                <pilot-edit-modal
                  title="Edit Mech Skills"
                  :modelRef="mechSkillModal"
                  ref="mechSkillSelector"
                  :highlight="pilot.IsMissingHASE"
                >
                  <mech-skills-selector
                    slot="modal-content"
                    :pilot="pilot"
                    @close="setMechSkills"
                  />
                </pilot-edit-modal>
              </span>
              <span>Edit Pilot Mech Skills</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-layout center justify-space-around class="pl-5">
          <hase-pips title="hull" attribute="hull" />
          <hase-pips title="agility" attribute="agi" />
          <hase-pips title="systems" attribute="sys" />
          <hase-pips title="engineering" attribute="eng" />
        </v-layout>

        <!-- CORE Bonuses -->
        <v-layout class="header" justify-space-around>
          <v-flex>
            <span>CORE Bonuses</span>
          </v-flex>
          <v-flex shrink>
            <v-tooltip left>
              <v-chip
                :outline="!pilot.IsMissingCBs"
                small
                slot="activator"
                :color="pilot.IsMissingCBs ? 'warning' : ''"
              >
                {{ pilot.CurrentCBPoints }}/{{ pilot.MaxCBPoints }}
              </v-chip>
              <div>
                <span>
                  {{ pilot.MaxCBPoints - pilot.CurrentCBPoints }}
                  CORE Bonuses remaining
                </span>
              </div>
            </v-tooltip>
            <v-tooltip left>
              <span slot="activator">
                <pilot-edit-modal
                  title="Edit CORE Bonuses"
                  :modelRef="bonusModal"
                  ref="bonusSelector"
                  :highlight="pilot.IsMissingCBs"
                >
                  <core-bonus-selector slot="modal-content" :pilot="pilot" />
                </pilot-edit-modal>
              </span>
              <span>Edit Pilot CORE Bonuses</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-layout row v-for="cb in pilot.CoreBonuses" :key="cb.ID" class="ml-5 mr-5">
          <core-bonus-item :cb="cb" />
        </v-layout>

        <!-- Pilot Loadout -->
        <v-layout class="header">
          <span>Pilot Gear</span>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <pilot-loadout :pilot="pilot" />
          </v-flex>
        </v-layout>
      </v-container>

      <v-divider />

      <!-- Print Block -->
      <v-layout class="ma-5">
        <v-flex>
          <v-btn color="primary" large outline block @click="openPrintOptions()">
            <v-icon>print</v-icon>
            &emsp; PRINT PILOT SHEET
          </v-btn>
          <v-btn color="primary" small flat block @click="copyPilotStatblock()">
            copy pilot statblock &nbsp;
            <v-tooltip top>
              <v-icon slot="activator" small color="grey">help</v-icon>
              <span>
                This produces a small raw text overview of the current Pilot and copies it to the
                clipboard.
              </span>
            </v-tooltip>
          </v-btn>
        </v-flex>
      </v-layout>

      <v-snackbar v-model="snackbar" :timeout="5000">
        <span v-html="notification" />
        <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>

      <v-dialog v-model="printDialog" persistent width="500px">
        <v-card>
          <v-card-text class="text-xs-center effect-text">
            Include a mech from {{ pilot.Callsign }}'s hangar?
            <v-select
              :items="pilot.Mechs"
              box
              label="Mech"
              item-text="Name"
              item-value="ID"
              @change="printMech = $event"
              class="mt-3"
            >
              <template v-slot:selection="{ item }">
                <span class="minor-title">
                  {{ item.name }}
                  <span class="caption grey--text">
                    {{ item.Frame.Source }} {{ item.Frame.Name }}
                  </span>
                </span>
              </template>
            </v-select>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="primary" @click="print(false)">No</v-btn>
            <v-spacer />
            <v-btn color="primary" @click="print(true, printMech)" :disabled="!printMech">
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Missing/No Pilot Display -->
    <empty-view v-else>
      <p slot="contents" class="grey--text text-xs-center display-2">
        NO PILOT LOADED
      </p>
    </empty-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { clipboard } from 'electron'
import {
  LazyDialog,
  EditableLabel,
  EditableTextfield,
  PipBar,
  EmptyView,
  TickBar,
} from '../components/UI'
import {
  ImageSelector,
  BackgroundSelector,
  SkillSelector,
  TalentSelector,
  LicenseSelector,
  MechSkillsSelector,
  CoreBonusSelector,
  LevelSelector,
} from './Selectors'
import DowntimeSelector from './Downtime/DowntimeSelector.vue'
import {
  LicenseItem,
  SkillItem,
  TalentItem,
  CoreBonusItem,
  PilotEditModal,
  HasePips,
} from './SheetComponents'
import PilotLoadout from './LoadoutEditor/PilotLoadout.vue'
import NewConfig from '../HangarView/AddConfigMenu.vue'
import Reserve from './Downtime/Reserve.vue'
import { Pilot, PilotSkill, Background, Statblock, Mech } from '@/class'
import { rules } from 'lancer-data'

export default Vue.extend({
  name: 'pilot-sheet',
  components: {
    EditableLabel,
    EditableTextfield,
    LicenseItem,
    SkillItem,
    TalentItem,
    PilotLoadout,
    CoreBonusItem,
    ImageSelector,
    BackgroundSelector,
    SkillSelector,
    TalentSelector,
    LicenseSelector,
    MechSkillsSelector,
    CoreBonusSelector,
    NewConfig,
    LazyDialog,
    PilotEditModal,
    LevelSelector,
    PipBar,
    HasePips,
    EmptyView,
    TickBar,
    Reserve,
    DowntimeSelector,
  },
  data: () => ({
    CallsignDialog: false,
    newCallsign: '',
    renameDialog: false,
    newName: '',
    newConfigModal: false,
    backgroundModal: false,
    appearanceModal: false,
    downtimeModal: false,
    skillModal: false,
    licenseModal: false,
    talentModal: false,
    mechSkillModal: false,
    bonusModal: false,
    pilotGearModal: false,
    printDialog: false,
    levelEditor: false,
    snackbar: false,
    printMech: null,
    notification: '',
    activeLoadoutIdx: 0,
    loadoutForceReloadTrigger: 0,
  }),
  computed: {
    pilot(): Pilot {
      return this.$store.getters['getPilot']
    },
    maxLevel(): number {
      return rules.max_pilot_level
    },
  },
  methods: {
    refresh: function() {
      this.$forceUpdate()
    },
    notify: function(contents: string) {
      this.notification = contents
      this.snackbar = true
    },
    close(ref: string) {
      ;(this.$refs[ref] as any).cancel()
    },
    setBackground() {
      ;(this.$refs['backgroundSelector'] as any).cancel()
      this.backgroundModal = false
    },
    setPilotTalents() {
      this.talentModal = false
    },
    setMechSkills() {
      ;(this.$refs['mechSkillSelector'] as any).cancel()
    },
    closePortrait() {
      ;(this.$refs['appearanceSelector'] as any).cancel()
      this.appearanceModal = false
    },
    closeDowntime() {
      ;(this.$refs['downtimeSelector'] as any).cancel()
      this.downtimeModal = false
    },
    openPrintOptions() {
      if (this.pilot.ActiveConfig) {
        this.printDialog = true
      } else {
        this.$store.dispatch('setPrintOptions', {
          loadout_index: this.activeLoadoutIdx,
        })
        this.$router.push('/print-pilot')
      }
    },
    print: function(includeMech: boolean, mechID?: string) {
      this.printDialog = false
      let mech = null
      if (mechID) {
        mech = this.pilot.Mechs.find(x => x.ID === mechID)
      }
      this.$store.dispatch('setPrintOptions', {
        combo: includeMech,
        mech: mech,
      })
      if (includeMech) {
        this.$router.push('/print-all')
      } else {
        this.$router.push('/print-pilot')
      }
      this.printMech = null
    },
    copyPilotStatblock() {
      clipboard.writeText(Statblock.Generate(this.pilot, this.pilot.ActiveMech))
      this.notify('Pilot Statblock Copied to Clipboard')
    },
  },
})
</script>

<style>
.header {
  background-color: lightgray;
  color: black;
  font-weight: bold;
  letter-spacing: 3px;
  height: 40px;
  line-height: 40px;
  width: 100%;
  padding-left: 10px;
  margin-top: 10px;
  margin-bottom: 3px;
}

.float-right {
  float: right;
  text-align: right;
}

.no-icon {
  height: 40px;
  padding-top: 8px;
}
</style>
