export default class HashMap {
    constructor() {
        this.bucketCapacity = 16;
        this.loadFactor = 0.75;
        this.count = 0;
        this.buckets = [];
        for (let i = 0; i < this.bucketCapacity; i++) {
            this.buckets.push([]);
        }
    }

    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash |= 0; // Convert to 32-bit integer
        }
        return Math.abs(hash) % this.bucketCapacity;
    }

    set(key, value) {
        const index = this.hash(key);
        const bucket = this.buckets[index];

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value; // Update value if key already exists
                return;
            }
        }

        bucket.push([key, value]);
        this.count++;

        if (this.count > this.bucketCapacity * this.loadFactor) {
            this.resize();
        }
    }

    get(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                return bucket[i][1];
            }
        }
        return undefined;
    }

    has(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                return true;
            }
        }
        return false;
    }

    remove(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket.splice(i, 1); // Remove the entry
                this.count--;
                return true; // Return true on successful deletion
            }
        }
        return false; // Return false if key not found
    }

    // get the number of keys
    length() {
        return this.count;
    }

    clear() {
        this.buckets = [];
        this.count = 0;
        for (let i = 0; i < this.bucketCapacity; i++) {
            this.buckets.push([]);
        }
    }

    // get all keys in the hash map
    keys() {
        const keysArray = [];
        for (const bucket of this.buckets) {
            for (const [key, value] of bucket) {
                keysArray.push(key);
            }
        }
        return keysArray;
    }

    values() {
        const valuesArray = [];
        for (const bucket of this.buckets) {
            for (const [key, value] of bucket) {
                valuesArray.push(value);
            }
        }
        return valuesArray;
    }

    entries() {
        const entriesArray = [];
        for (const bucket of this.buckets) {
            for (const [key, value] of bucket) {
                entriesArray.push([key, value]);
            }
        }
        return entriesArray;
    }

    // Resize method to increase bucket size when load factor is exceeded
    resize() {
        const oldBuckets = this.buckets;
        this.bucketCapacity *= 2;
        this.count = 0;
        this.buckets = Array.from({ length: this.bucketCapacity }, () => []);

        for (const bucket of oldBuckets) {
            for (const [key, value] of bucket) {
                this.set(key, value);
            }
        }
    }
}
