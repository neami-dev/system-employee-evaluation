import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase-config";
import { editProfile } from "../auth/editProfile";

export async function uploadImage(uid, image) {
    let result,
        error = null;
        try {
        const imageListRef = ref(storage, "ProfilePhoto");
        // add a profile photo
        const imageRef = ref(storage, `ProfilePhoto/${uid}`);
        await uploadBytes(imageRef, image);

        // get photo URL and add it to employee data
        const items = await listAll(imageListRef);
        const item = items?.items.find((item) => item?.name === uid);
        const photoURL = await getDownloadURL(item);
        result = await editProfile({ photoURL });
    } catch (e) {
        error = e;
    }
    return { ...result, error };
}
