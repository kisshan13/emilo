class ClaimLocks {
    /**
     * @type {Map<string, string>}
     */
    #locks
    constructor() {
        this.#locks = new Map();
    }

    addLock(claimId, userId) {
        this.#locks.set(claimId, userId)
    }

    removeLock(claimId) {
        this.#locks.delete(claimId)
    }

    getLocks() {
        return Array.from(this.#locks.keys())
    }

    lock() {
        return this.#locks
    }
}

const claimLocks = new ClaimLocks();

export default claimLocks;