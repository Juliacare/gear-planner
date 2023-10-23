import {JobName} from "../xivconstants";
import {AttackType} from "../geartypes";
import {CombinedBuffEffect} from "./sim_processors";

export type NonDamagingAbility = {
    potency: null,
}
export type DamagingAbility = {
    potency: number,
    attackType: AttackType,
    autoCrit?: boolean,
    autoDh?: boolean,
}

export type BaseAbility = Readonly<{
    name: string,
    activatesBuffs?: readonly Buff[],
} & (NonDamagingAbility | DamagingAbility)>;

/**
 * Represents an ability you can use
 */
export type GcdAbility = BaseAbility & {
    type: 'gcd';
    /**
     * If the ability's GCD can be lowered by sps/sks, put it here.
     */
    gcd: number,
    /**
     * The time that it takes to cast. Do not include caster tax. Defaults to 0.5 (thus 0.6 after adding caster tax)
     * if not specified, i.e. normal animation lock.
     */
    cast?: number,
    /**
     * If the ability has a fixed cast and recast, rather than being reduced by sks/sps,
     * set to true.
     */
    fixedGcd?: boolean,
}

export type OgcdAbility = BaseAbility & Readonly<{
    type: 'ogcd',
    animationLock?: number,
}>

export type Ability = GcdAbility | OgcdAbility;

export type ComputedDamage = {
    expected: number,
}

/**
 * Represents an ability actually being used
 */
export type UsedAbility = {
    ability: Ability,
    buffs: Buff[],
    combinedEffects: CombinedBuffEffect,
    usedAt: number,
    damage: ComputedDamage
}

/**
 * Represents a pseudo-ability used to round out a cycle to exactly 120s.
 *
 * e.g. If our last GCD of the 120s cycle would start at 118.9s, then we do not have enough time
 * remaining for an entire GCD. Thus, we would have a PartialAbility with portion = (1.1s / 2.5s)
 *
 */
export type PartiallyUsedAbility = UsedAbility & {
    portion: number
}

export type BuffEffects = {
    dmgIncrease?: number,
    critChanceIncrease?: number,
    dhitChanceIncrease?: number,
    haste?: number,
}

export type Buff = Readonly<{
    /** Name of buff */
    name: string,
    /** Job of buff */
    job: JobName,
    /** "Optional" would be things like DNC partner buffs, where merely having the job
    // in your comp does not mean you would necessarily get the buff. */
    optional?: boolean,
    /** Can only apply to self - not a party/targeted buff */
    selfOnly?: boolean,
    /** Cooldown */
    cooldown: number,
    /** Duration */
    duration: number,
    /** The effect(s) of the buff */
    effects: BuffEffects;
    /**
     * Time of usage - can be omitted for buffs that would only be used by self and never auto-activated
     */
    startTime?: number,
}>;
