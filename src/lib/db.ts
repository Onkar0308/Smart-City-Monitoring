import {
  collection,
  doc,
  getDocs,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  QueryConstraint,
  serverTimestamp,
  DocumentSnapshot,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionName: string,
  documentId: string
) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
  } catch (error) {
    console.error(`Error deleting document in ${collectionName}:`, error);
    throw error;
  }
};

export const queryDocuments = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: DocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    })) as (T & { id: string })[];
  } catch (error) {
    console.error(`Error querying documents in ${collectionName}:`, error);
    throw error;
  }
};

// Helper function to get a single document by ID
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T & { id: string };
    }
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};