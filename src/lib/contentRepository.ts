import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { catalog as seedCatalog, guides as seedGuides } from "@/data/catalog";
import { db } from "@/lib/firebase";
import type { CatalogItem, Guide } from "@/types";

export async function getPublishedCatalog(): Promise<CatalogItem[]> {
  if (!db) return seedCatalog;

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "destinations"),
        where("status", "==", "published"),
        orderBy("sortOrder"),
        limit(100)
      )
    );

    if (snapshot.empty) return seedCatalog;
    return snapshot.docs.map(
      (document) =>
        ({
          id: document.id,
          ...document.data()
        }) as CatalogItem
    );
  } catch {
    return seedCatalog;
  }
}

export async function getPublishedGuides(): Promise<Guide[]> {
  if (!db) return seedGuides;

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "guides"),
        where("status", "==", "published"),
        orderBy("sortOrder"),
        limit(100)
      )
    );

    if (snapshot.empty) return seedGuides;
    return snapshot.docs.map(
      (document) =>
        ({
          id: document.id,
          ...document.data()
        }) as Guide
    );
  } catch {
    return seedGuides;
  }
}
