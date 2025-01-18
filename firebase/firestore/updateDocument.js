import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default async function updateDocument({ collectionName, id, data }) {
    let result = null,
        error = null;

        try {
        console.log("id : ", id);
        console.log("data : ", data);
        const ref = doc(db, collectionName, id);
        console.log("ref : ", ref);
        try {
            result = await updateDoc(ref, data);
            
        } catch (error) {
            console.log("error : ", error);
            
        }
        
    } catch (e) {
        error = e?.message || "Error updating";
        // console.log(error);
        
    }

    return { result, error };
}
