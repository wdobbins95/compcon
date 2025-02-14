import store from '@/store'
import _ from 'lodash'
import uid from '@/features/_shared/uid'
import { rules } from 'lancer-data'
import { Pilot, Frame, MechLoadout, MechSystem, IntegratedMount } from '@/class'

class Mech {
  private id: string
  private name: string
  private notes: string
  private portrait: string
  private cloud_portrait: string
  private frame: Frame
  private loadouts: MechLoadout[]
  private active_loadout: string | null
  private current_structure: number
  private current_hp: number
  private current_stress: number
  private current_heat: number
  private current_repairs: number
  private current_core_energy: number
  private current_overcharge: number
  private active: boolean
  private pilot: Pilot
  private cc_ver: string
  private statuses: string[]
  private conditions: string[]
  private resistances: string[]
  private burn: number

  constructor(frame: Frame, pilot: Pilot) {
    this.id = uid.generate()
    this.name = ''
    this.notes = ''
    this.portrait = ''
    this.cloud_portrait = ''
    this.frame = frame
    this.pilot = pilot
    this.loadouts = []
    this.active = false
    this.current_structure = this.MaxStructure
    this.current_hp = this.MaxHP
    this.current_stress = this.MaxStress
    this.current_heat = 0
    this.current_repairs = this.RepairCapacity
    this.current_core_energy = 1
    this.current_overcharge = 0
    this.active_loadout = null
    this.statuses = []
    this.conditions = []
    this.resistances = []
    this.burn = 0
    this.cc_ver = process.env.npm_package_version || 'UNKNOWN'
  }
  // -- Utility -----------------------------------------------------------------------------------
  private save() {
    store.dispatch('saveData')
  }

  // -- Info --------------------------------------------------------------------------------------
  public get ID(): string {
    return this.id
  }

  public RenewID() {
    this.id = uid.generate()
  }

  public get Name(): string {
    return this.name
  }

  public set Name(name: string) {
    this.name = name
    this.save()
  }

  public get Notes(): string {
    return this.notes
  }

  public set Notes(notes: string) {
    this.notes = notes
    this.save()
  }

  public get Frame(): Frame {
    return this.frame
  }

  public get IsActive() {
    return this.active
  }

  public set Active(toggle: boolean) {
    this.active = toggle
    if (this.IsActive) this.FullRepair()
    this.save()
  }

  public get RequiredLicenses(): ILicenseRequirement[] {
    let requirements = this.ActiveLoadout
      ? this.ActiveLoadout.RequiredLicenses
      : ([] as ILicenseRequirement[])

    if (this.frame.Name.toUpperCase() === 'EVEREST') {
      const gmsIdx = requirements.findIndex(x => x.source === 'GMS')
      if (gmsIdx > -1) requirements[gmsIdx].items.push('EVEREST Frame')
      else requirements.push(this.Frame.RequiredLicense)
    } else {
      const reqIdx = requirements.findIndex(x => x.name === `${this.frame.Name}` && x.rank === 2)
      if (reqIdx > -1) requirements[reqIdx].items.push(`${this.frame.Name.toUpperCase()} Frame`)
      else requirements.push(this.Frame.RequiredLicense)
    }

    for (const l of requirements) {
      if (l.source === 'GMS') continue
      l.missing = !this.pilot.has('License', l.name, l.rank)
    }

    return requirements.sort((a, b) => {
      return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0
    })
  }

  public get Active(): boolean {
    return this.active
  }

  public SetCloudPortrait(src: string) {
    this.cloud_portrait = src
    this.save()
  }

  public get CloudPortrait(): string {
    return this.cloud_portrait
  }

  public SetLocalPortrait(src: string) {
    this.portrait = src
    this.save()
  }

  public get LocalPortrait(): string {
    return this.portrait
  }

  public get Portrait(): string {
    if (this.cloud_portrait) return this.cloud_portrait
    else if (this.portrait) return `file://${store.getters.getUserPath}/img/frame/${this.portrait}`
    else return `file://${store.getters.getUserPath}/img/default_frames/${this.Frame.ID}.png`
  }

  // -- Attributes --------------------------------------------------------------------------------
  public get Size(): number {
    if (this.frame.Size === rules.max_frame_size) return rules.max_frame_size
    const bonus = this.pilot.has('CoreBonus', 'fomorian')
    if (bonus) {
      return this.frame.Size === 0.5 ? 1 : this.frame.Size + 1
    } else return this.frame.Size
  }

  public get SizeContributors(): string[] {
    let output = [`FRAME Base Size: ${this.Frame.Size}`]
    if (this.pilot.has('CoreBonus', 'fomorian'))
      output.push(`Fomorian Frame Reinforcement (IPS-N CORE Bonus): +1`)
    return output
  }

  public get Armor(): number {
    let bonus =
      this.pilot.has('CoreBonus', 'plating') && this.frame.Armor < rules.max_mech_armor ? 1 : 0
    return this.frame.Armor + bonus
  }

  public get ArmorContributors(): string[] {
    let output = [`FRAME Base Armor: ${this.Frame.Armor}`]
    if (this.pilot.has('CoreBonus', 'plating')) output.push(`Sloped Plating (IPS-N CORE Bonus): +1`)
    return output
  }

  public get SaveTarget(): number {
    let bonus = this.pilot.Grit
    if (this.pilot.has('CoreBonus', 'opendoor')) bonus += 2
    return this.frame.Save + bonus
  }

  public get SaveTargetContributors(): string[] {
    let output = [
      `FRAME Base Save Target: ${this.Frame.Save}`,
      `Pilot GRIT Bonus: +${this.pilot.Grit}`,
    ]
    if (this.pilot.has('CoreBonus', 'opendoor'))
      output.push(`The Lesson of the Open Door (HORUS CORE Bonus): +2`)
    return output
  }

  public get Evasion(): number {
    let bonus = this.Agi
    if (this.pilot.has('CoreBonus', 'fssync')) bonus += 2
    return this.frame.Evasion + bonus
  }

  public get EvasionContributors(): string[] {
    let output = [`FRAME Base Evasion: ${this.Frame.Evasion}`, `Pilot AGILITY Bonus: +${this.Agi}`]
    if (this.pilot.has('CoreBonus', 'fssync'))
      output.push(`Full Subjectivity Sync (SSC CORE Bonus): +2`)
    return output
  }

  public get Speed(): number {
    let bonus = Math.floor(this.Agi / 2)
    return this.frame.Speed + bonus
  }

  public get SpeedContributors(): string[] {
    return [
      `FRAME Base Speed: ${this.Frame.Speed}`,
      `Pilot AGILITY Bonus: +${Math.floor(this.Agi / 2)}`,
    ]
  }

  public get SensorRange(): number {
    return this.frame.SensorRange
  }

  public get SensorRangeContributors(): string[] {
    return [`FRAME Base Sensor Range: ${this.Frame.SensorRange}`]
  }

  public get EDefense(): number {
    let bonus = this.Sys
    if (this.pilot.has('CoreBonus', 'disbelief')) bonus += 2
    return this.frame.EDefense + bonus
  }

  public get EDefenseContributors(): string[] {
    let output = [
      `FRAME Base E-Defense: ${this.Frame.EDefense}`,
      `Pilot SYSTEMS Bonus: +${this.Sys}`,
    ]
    if (this.pilot.has('CoreBonus', 'disbelief'))
      output.push(`The Lesson of Disbelief (HORUS CORE Bonus): +2`)
    return output
  }

  public get LimitedBonus(): number {
    let bonus = 0
    if (this.pilot.has('CoreBonus', 'ammofeeds')) bonus += 2
    return Math.floor(this.Eng / 2) + bonus
  }

  public get LimitedContributors(): string[] {
    let output = [`Pilot ENGINEERING Bonus: +${Math.floor(this.Eng / 2)}`]
    if (this.pilot.has('CoreBonus', 'ammofeeds'))
      output.push(`Integrated Ammo Feeds (HA CORE Bonus): +5`)
    return output
  }

  public get AttackBonus(): number {
    return this.pilot.Grit
  }

  public get AttackBonusContributors(): string[] {
    return [`Pilot GRIT Bonus: ${this.pilot.Grit}`]
  }

  public get TechAttack(): number {
    let bonus = this.Sys
    return this.frame.TechAttack + bonus
  }

  public get TechAttackContributors(): string[] {
    return [`FRAME Base Tech Attack: ${this.Frame.TechAttack}`, `Pilot SYSTEMS Bonus: +${this.Sys}`]
  }

  public get Grapple(): number {
    return rules.base_grapple
  }

  public get Ram(): number {
    return rules.base_ram
  }

  public get SaveBonus(): number {
    return this.pilot.Grit
  }

  public get SaveBonusContributors(): string[] {
    return [`Pilot GRIT Bonus: ${this.pilot.Grit}`]
  }

  // -- HASE --------------------------------------------------------------------------------------
  public get Hull(): number {
    return this.pilot.MechSkills.Hull
  }

  public get Agi(): number {
    return this.pilot.MechSkills.Agi
  }

  public get Sys(): number {
    return this.pilot.MechSkills.Sys
  }

  public get Eng(): number {
    return this.pilot.MechSkills.Eng
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get CurrentStructure(): number {
    return this.active ? this.current_structure : this.MaxStructure
  }

  public set CurrentStructure(structure: number) {
    if (structure > this.MaxStructure) this.current_structure = this.MaxStructure
    else if (structure < 0) this.current_structure = 0
    else this.current_structure = structure
    this.save()
  }

  public get MaxStructure(): number {
    return this.frame.Structure
  }

  public get StructureContributors(): string[] {
    return [`FRAME Base Structure: ${this.Frame.Structure}`]
  }

  public get CurrentHP(): number {
    return this.current_hp
  }

  public set CurrentHP(hp: number) {
    if (hp > this.MaxHP) this.current_hp = this.MaxHP
    else if (hp < 0) this.current_hp = 0
    else this.current_hp = hp
    this.save()
  }

  public AddDamage(dmg: number, resistance?: string) {
    if (resistance && this.resistances.includes(resistance)) {
      dmg = Math.ceil(dmg / 2)
    }
    while (dmg > this.CurrentHP) {
      this.CurrentStructure -= 1
      dmg -= this.CurrentHP
      this.current_hp = this.MaxHP
    }
    this.CurrentHP -= dmg
  }

  public get MaxHP(): number {
    let bonus = this.pilot.Grit + this.Hull * 2
    if (this.ActiveLoadout) {
      const personalizations = this.ActiveLoadout.GetSystem('personalizations')
      if (personalizations && !personalizations.IsDestroyed) bonus += 2
    }
    if (this.pilot.has('CoreBonus', 'frame')) bonus += 5
    return this.frame.HP + bonus
  }

  public get HPContributors(): string[] {
    let output = [
      `FRAME Base HP: ${this.Frame.HP}`,
      `Pilot GRIT Bonus: +${this.pilot.Grit}`,
      `Pilot HULL Bonus: +${this.Hull * 2}`,
    ]
    if (this.ActiveLoadout && this.ActiveLoadout.HasSystem('personalizations'))
      output.push(`Personalizations (GMS System): +2`)
    if (this.pilot.has('CoreBonus', 'frame')) output.push(`Reinforced Frame (IPS-N CORE Bonus): +5`)
    return output
  }

  public get CurrentSP(): number {
    if (!this.ActiveLoadout) return this.MaxSP
    return this.ActiveLoadout.TotalSP
  }

  public get MaxSP(): number {
    let bonus = this.pilot.Grit + Math.floor(this.Sys / 2)
    return this.Frame.SP + bonus
  }

  public get SPContributors(): string[] {
    return [
      `FRAME Base SP: ${this.Frame.SP}`,
      `Pilot GRIT Bonus: +${this.pilot.Grit}`,
      `Pilot SYSTEMS Bonus: +${Math.floor(this.Sys / 2)}`,
    ]
  }

  public get CurrentHeat(): number {
    return this.active ? this.current_heat : this.HeatCapacity
  }

  public set CurrentHeat(heat: number) {
    if (heat > this.HeatCapacity) this.current_heat = this.HeatCapacity
    else if (heat < 0) this.current_heat = 0
    else this.current_heat = heat
    this.save()
  }

  public AddHeat(heat: number) {
    heat = this.resistances.includes('Heat') ? Math.ceil(heat / 2) : heat
    let newHeat = this.current_heat + heat
    while (newHeat > this.HeatCapacity) {
      this.CurrentStress -= 1
      newHeat -= this.HeatCapacity
    }
    this.CurrentHeat = newHeat
  }

  public ReduceHeat(heat: number, resist?: boolean) {
    if (resist) heat = this.resistances.includes('Heat') ? Math.ceil(heat / 2) : heat
    while (heat > this.CurrentHeat) {
      heat -= this.CurrentHeat
      this.CurrentStress += 1
      this.current_heat = this.HeatCapacity
    }
    this.CurrentHeat -= heat
  }

  public get IsInDangerZone(): boolean {
    return this.IsActive && this.current_heat >= Math.ceil(this.HeatCapacity / 2)
  }

  public get HeatCapacity(): number {
    var bonus = this.Eng
    if (this.pilot.has('CoreBonus', 'superior')) bonus += 2
    return this.frame.HeatCap + bonus
  }

  public get HeatCapContributors(): string[] {
    let output = [
      `FRAME Base Heat Capacity: ${this.Frame.HeatCap}`,
      `Pilot ENGINEERING Bonus: +${this.Eng}`,
    ]
    if (this.pilot.has('CoreBonus', 'superior'))
      output.push(`Superior By Design (HA CORE Bonus): +2`)
    return output
  }

  public get CurrentStress(): number {
    return this.active ? this.current_stress : this.MaxStress
  }

  public set CurrentStress(stress: number) {
    if (stress > this.MaxStress) this.current_stress = this.MaxStress
    else if (stress < 0) this.current_stress = 0
    else this.current_stress = stress
    this.save()
  }

  public get MaxStress(): number {
    return this.frame.HeatStress
  }

  public get StressContributors(): string[] {
    return [`FRAME Base Reactor Stress: ${this.Frame.HeatStress}`]
  }

  public get CurrentRepairs(): number {
    return this.active ? this.current_repairs : this.RepairCapacity
  }

  public set CurrentRepairs(rep: number) {
    if (rep > this.RepairCapacity) this.current_repairs = this.RepairCapacity
    else if (rep < 0) this.current_repairs = 0
    else this.current_repairs = rep
    this.save()
  }

  public get RepairCapacity(): number {
    var bonus = Math.floor(this.Hull / 2)
    return this.frame.RepCap + bonus
  }

  public get RepCapContributors(): string[] {
    return [
      `FRAME Base Repair Capacity: ${this.Frame.RepCap}`,
      `Pilot HULL Bonus: +${Math.floor(this.Hull / 2)}`,
    ]
  }

  public get CurrentCoreEnergy(): number {
    return this.active ? this.current_core_energy : 1
  }

  public set CurrentCoreEnergy(energy: number) {
    this.current_core_energy = energy < 1 ? 0 : 1
    this.save()
  }

  public get CurrentOvercharge(): number {
    return this.active ? this.current_overcharge : 0
  }

  public set CurrentOvercharge(overcharge: number) {
    this.current_overcharge = overcharge
    this.save()
  }

  // -- Statuses and Conditions -------------------------------------------------------------------
  public get IsShutDown(): boolean {
    return this.Statuses.includes('Shut Down')
  }

  public get IsStunned(): boolean {
    return this.conditions.includes('Stunned')
  }

  public get Conditions(): string[] {
    return this.conditions
  }

  public set Conditions(conditions: string[]) {
    this.conditions = conditions
    this.save()
  }

  public get Statuses(): string[] {
    return this.statuses
  }

  public set Statuses(statuses: string[]) {
    this.statuses = statuses
    this.save()
  }

  public get Resistances(): string[] {
    return this.resistances
  }

  public set Resistances(resistances: string[]) {
    this.resistances = resistances
    this.save()
  }

  public get Burn(): number {
    return this.burn
  }

  public set Burn(burn: number) {
    this.burn = burn
    if (this.burn < 0) this.burn = 0
    this.save()
  }

  // -- Active Mode Utilities ---------------------------------------------------------------------
  public FullRepair() {
    this.CurrentStructure = this.MaxStructure
    this.CurrentHP = this.MaxHP
    this.CurrentStress = this.MaxStress
    this.CurrentHeat = 0
    this.CurrentRepairs = this.RepairCapacity
    this.CurrentCoreEnergy = 1
    this.CurrentOvercharge = 0
    this.loadouts.forEach(x => {
      x.Equipment.forEach(y => {
        if (y.IsLimited) y.Uses = y.MaxUses + this.LimitedBonus
      })
    })
    this.statuses = []
    this.conditions = []
    this.resistances = []
    this.Burn = 0
    this.save()
  }

  // -- Integrated/Talents ------------------------------------------------------------------------
  public get IntegratedMounts(): IntegratedMount[] {
    let intg = []
    if (this.frame.CoreSystem.Integrated) {
      intg.push(new IntegratedMount(this.frame.CoreSystem.Integrated, 'CORE System'))
    }
    if (this.pilot.has('Talent', 'ncavalier', 3)) {
      const fr_weapon = store.getters.getItemById('MechWeapons', 'fuelrod')
      intg.push(new IntegratedMount(fr_weapon, 'Nuclear Cavalier'))
    }
    if (this.pilot.has('Talent', 'eng')) {
      const id = `prototype${this.pilot.getTalentRank('eng')}`
      const eng_weapon = store.getters.getItemById('MechWeapons', id)
      intg.push(new IntegratedMount(eng_weapon, 'Engineer'))
    }
    return intg
  }

  public get IntegratedSystems(): MechSystem[] {
    let intg = []
    if (this.pilot.has('Talent', 'armsman')) {
      const arms = store.getters.getItemById(
        'MechSystems',
        `armsman${this.pilot.getTalentRank('armsman')}`
      )
      intg.push(new MechSystem(arms))
    }
    if (this.pilot.has('Talent', 'techno')) {
      const techno = store.getters.getItemById(
        'MechSystems',
        `techno${this.pilot.getTalentRank('techno')}`
      )
      intg.push(new MechSystem(techno))
    }
    return intg
  }

  // -- Loadouts ----------------------------------------------------------------------------------
  public get Loadouts(): MechLoadout[] {
    return this.loadouts
  }

  public AddLoadout() {
    this.loadouts.push(new MechLoadout(this))
    this.ActiveLoadout = this.loadouts[this.loadouts.length - 1]
    this.save()
  }

  public RemoveLoadout(loadout: MechLoadout) {
    const index = this.loadouts.findIndex(x => _.isEqual(x, loadout))
    if (index === -1) {
      console.error(`Loadout"${loadout.Name}" does not exist on Mech ${this.Name}`)
    } else {
      this.loadouts.splice(index, 1)
      this.ActiveLoadout = this.loadouts[this.loadouts.length - 1]
    }
    this.save()
  }

  public CloneLoadout(loadout: MechLoadout) {
    const index = this.loadouts.findIndex(x => _.isEqual(x, loadout))
    if (index === -1) {
      console.error(`Loadout "${loadout.Name}" does not exist on Mech ${this.Name}`)
    } else {
      var newLoadout = MechLoadout.Deserialize(MechLoadout.Serialize(loadout), this)
      newLoadout.RenewID()
      newLoadout.Name += ' (Copy)'
      this.loadouts.splice(index + 1, 0, newLoadout)
    }
    this.save()
  }

  public get ActiveLoadout(): MechLoadout | null {
    return this.loadouts.find(x => x.ID === this.active_loadout) || null
  }

  public set ActiveLoadout(loadout: MechLoadout | null) {
    this.active_loadout = loadout.ID || ''
    this.save()
  }

  // -- I/O ---------------------------------------------------------------------------------------
  public static Serialize(m: Mech): IMechData {
    return {
      id: m.ID,
      name: m.Name,
      notes: m.Notes,
      portrait: m.portrait,
      cloud_portrait: m.cloud_portrait,
      frame: m.Frame.ID,
      active: m.active,
      current_structure: m.current_structure,
      current_hp: m.current_hp,
      current_stress: m.current_stress,
      current_heat: m.current_heat,
      current_repairs: m.current_repairs,
      current_overcharge: m.current_overcharge,
      loadouts: m.Loadouts.map(x => MechLoadout.Serialize(x)),
      active_loadout: m.active_loadout,
      statuses: m.statuses,
      conditions: m.conditions,
      resistances: m.resistances,
      burn: m.burn,
      cc_ver: m.cc_ver,
    }
  }

  public static Deserialize(mechData: IMechData, pilot: Pilot): Mech {
    const f = store.getters.getItemById('Frames', mechData.frame)
    let m = new Mech(f, pilot)
    m.id = mechData.id
    m.name = mechData.name
    m.notes = mechData.notes
    m.portrait = mechData.portrait
    m.cloud_portrait = mechData.cloud_portrait
    m.active = mechData.active
    m.current_structure = mechData.current_structure
    m.current_hp = mechData.current_hp
    m.current_stress = mechData.current_stress
    m.current_heat = mechData.current_heat
    m.current_repairs = mechData.current_repairs
    m.current_overcharge = mechData.current_overcharge || 0
    m.cc_ver = mechData.cc_ver
    m.loadouts = mechData.loadouts.map((x: IMechLoadoutData) => MechLoadout.Deserialize(x, m))
    m.active_loadout = m.active_loadout
    m.statuses = mechData.statuses || []
    m.conditions = mechData.conditions || []
    m.resistances = mechData.resistances || []
    m.burn = mechData.burn
    m.cc_ver = mechData.cc_ver || ''
    return m
  }
}

export default Mech
