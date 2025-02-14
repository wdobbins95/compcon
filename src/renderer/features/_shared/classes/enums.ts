enum MountType {
  Main = 'Main',
  Heavy = 'Heavy',
  AuxAux = 'Aux/Aux',
  Aux = 'Aux',
  MainAux = 'Main/Aux',
  Flex = 'Flex',
  Integrated = 'Integrated',
}

// governs what can be added to a mount (weapon slot)
enum FittingSize {
  Auxiliary = 'Auxiliary',
  Main = 'Main',
  Flex = 'Flex',
  Heavy = 'Heavy',
  Integrated = 'Integrated',
}

enum WeaponSize {
  Aux = 'Auxiliary',
  Main = 'Main',
  Heavy = 'Heavy',
  Superheavy = 'Superheavy',
}

enum WeaponType {
  Rifle = 'Rifle',
  Cannon = 'Cannon',
  Launcher = 'Launcher',
  CQB = 'CQB',
  Nexus = 'Nexus',
  Melee = 'Melee',
}

enum ItemType {
  None = '',
  Action = 'Action',
  Background = 'Background',
  CoreBonus = 'CoreBonus',
  Frame = 'Frame',
  PilotArmor = 'PilotArmor',
  PilotWeapon = 'PilotWeapon',
  PilotGear = 'PilotGear',
  Skill = 'Skill',
  Talent = 'Talent',
  Tag = 'Tag',
  MechWeapon = 'MechWeapon',
  MechSystem = 'MechSystem',
  WeaponMod = 'WeaponMod',
}

enum SystemType {
  System = 'System',
  AI = 'AI',
  Shield = 'Shield',
  Deployable = 'Deployable',
  Drone = 'Drone',
  Tech = 'Tech',
  Armor = 'Armor',
  FlightSystem = 'Flight System',
  Integrated = 'Integrated',
  Mod = 'Mod',
}

enum SkillFamily {
  str = 'str',
  dex = 'dex',
  int = 'int',
  cha = 'cha',
}

enum RangeType {
  Range = 'Range',
  Threat = 'Threat',
  Thrown = 'Thrown',
  Line = 'Line',
  Cone = 'Cone',
  Blast = 'Blast',
  Burst = 'Burst',
}

enum DamageType {
  Kinetic = 'Kinetic',
  Energy = 'Energy',
  Explosive = 'Explosive',
  Heat = 'Heat',
  Burn = 'Burn',
  Variable = 'Variable',
}

enum MechType {
  Balanced = 'Balanced',
  Artillery = 'Artillery',
  Striker = 'Striker',
  Controller = 'Controller',
  Support = 'Support',
  Defender = 'Defender',
}

enum HASE {
  H = 'hull',
  A = 'agi',
  S = 'sys',
  E = 'eng',
}

enum ReserveType {
  Narrative = 'Narrative',
  Tactical = 'Tactical',
  Mech = 'Mech',
}

// enum NarrativeReserve {
//   Access = 'Access',
//   Backing = 'Backing',
//   Supplies = 'Supplies',
//   Disguise = 'Disguise',
//   Diversion = 'Diversion',
//   Reputation = 'Reputation',
//   SafeHarbor = 'Safe Harbor',
//   Tracking = 'Tracking',
//   Knowledge = 'Knowledge',
// }

// enum TacticalReserve {
//   Scouting = 'Scouting',
//   Vehicle = 'Vehicle',
//   Reinforcements = 'Reinforcements',
//   EnvironmentalShielding = 'Environmental Shielding',
//   Accuracy = 'Accuracy',
//   Ambush = 'Ambush',
//   OrbitalDrop = 'Orbital Drop',
//   NHPAssistant = 'NHP Assistant',
//   Bombardment = 'Bombardment',
//   ExtendedHarness = 'Extended Harness',
// }

// enum MechReserve {
//   CoreBattery = 'Core Battery',
//   DeployableShield = 'Deployable Shield',
//   RedundantRepair = 'Redundant Repair ',
//   SystemsReinforcement = 'Systems Reinforcement',
//   SmartAmmo = 'Smart Ammo',
//   BoostedServos = 'Boosted Servos',
//   JumpJets = 'Jump Jets',
// }

export {
  MountType,
  FittingSize,
  WeaponSize,
  WeaponType,
  ItemType,
  SystemType,
  SkillFamily,
  RangeType,
  DamageType,
  HASE,
  MechType,
  ReserveType,
  // NarrativeReserve,
  // TacticalReserve,
  // MechReserve,
}
