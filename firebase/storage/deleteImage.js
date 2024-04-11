import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase-config";
import { editProfile } from "../auth/editProfile";

export async function deleteImage(pathName) {
    let result,
        error = null;
    try {
        const desertRef = ref(storage, pathName);
        await deleteObject(desertRef);
        await editProfile({ photoURL: "" });
        result = true;
    } catch (e) {
        error = e;
    }
    return { result, error };
}
