import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, increment, runTransaction, onSnapshot } from "firebase/firestore";

// Add Diamonds (Earning)
export const addDiamonds = async (amount) => {
    const nickname = localStorage.getItem('wedding_nickname');
    if (!nickname) return;
    if (amount <= 0) return;

    try {
        const userRef = doc(db, "users", nickname);
        await updateDoc(userRef, {
            diamonds: increment(amount)
        });
        console.log(`Earned ${amount} Diamonds!`);
    } catch (error) {
        console.error("Error adding diamonds:", error);
    }
};

// Spend Diamonds (Spending)
export const spendDiamonds = async (amount) => {
    const nickname = localStorage.getItem('wedding_nickname');
    if (!nickname) return false;

    const userRef = doc(db, "users", nickname);

    try {
        const success = await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw "User does not exist!";
            }

            const currentDiamonds = userDoc.data().diamonds || 0;
            if (currentDiamonds < amount) {
                return false; // Insufficient funds
            }

            transaction.update(userRef, {
                diamonds: increment(-amount)
            });
            return true;
        });

        return success;
    } catch (error) {
        console.error("Transaction failed: ", error);
        return false;
    }
};

// Listen to Balance (Real-time UI)
export const subscribeToDiamonds = (callback) => {
    const nickname = localStorage.getItem('wedding_nickname');
    if (!nickname) {
        callback(0);
        return () => { };
    }

    const userRef = doc(db, "users", nickname);
    const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data().diamonds || 0);
        } else {
            callback(0);
        }
    });

    return unsubscribe;
};
