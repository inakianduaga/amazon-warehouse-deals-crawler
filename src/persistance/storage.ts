import { LocalStorage } from 'node-localstorage'
import config from '../config/config'

const ls = new LocalStorage(config.persistance.path, Infinity)

export const hasBeenSent = (id: string) => ls.getItem(id) !== null
export const flagAsSent = (id: string) => ls.setItem(id, '')
export const storageCount = () => ls.length
