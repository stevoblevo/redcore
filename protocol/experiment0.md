# Experiment 0 — photograph 20 bricks twice

This is the camera baseline. Not the product.
If a phone already tells lot A from lot B, magnetics has to beat that later.

Time: one evening + ten minutes the next day.
Cost: $0 if you already have clay bricks.
Concrete pavers do not count.

Full issue: https://github.com/stevoblevo/redcore/issues/11

---

## 1. Get two lots of clay bricks

- **Lot A:** 10 fired-clay commons from one store stack (same pallet if you can).
- **Lot B:** 10 from a *different* stack, store, or Habitat ReStore.

Write on the **end**, not the face you will photograph:

```
A-01
A-02
…
B-10
```

---

## 2. Take the first set of photos

Same table. Same lamp or window. Same distance.

1. Put one brick on the table, photographed face up.
2. Put a coin or a ruler in the frame so scale is obvious.
3. Take one photo of that face. No flash if you can help it.
4. Do all 20 bricks before you move the lamp.

Name the files exactly like this:

```
A-01_pass1.jpg
A-02_pass1.jpg
…
B-10_pass1.jpg
```

If your phone names them `IMG_1234.jpg`, that is fine. You will list the real names in the spreadsheet.

---

## 3. Weigh them

Kitchen scale is enough. Grams if you have them, ounces if not. Write the number next to the label.

---

## 4. Second set (next day, or after you mix the pile)

Same face. Same light. Same distance.

```
A-01_pass2.jpg
…
B-10_pass2.jpg
```

Do not look at the labels while you guess which pile is A and which is B. Write that guess down.

---

## 5. Make a tiny spreadsheet

Any spreadsheet app. Save as `manifest.csv`.

```
id,lot,mass_g,photo1,photo2,guess
A-01,A,2150,A-01_pass1.jpg,A-01_pass2.jpg,
A-02,A,2210,A-02_pass1.jpg,A-02_pass2.jpg,
B-01,B,1980,B-01_pass1.jpg,B-01_pass2.jpg,
```

One extra row at the bottom, or a note in the issue comment:

> I could / could not tell the two lots apart by eye. Reason: …

---

## 6. How to send the photos (pick the easiest)

**Way 1 — easiest. No GitHub skills.**

1. Put the 40 photos + `manifest.csv` in one folder named `experiment0-yourname`.
2. Zip that folder (on a phone: share the folder to Files, then compress; on a computer: right-click → Compress).
3. Open https://github.com/stevoblevo/redcore/issues/11
4. Comment `mine` if you have not already.
5. Drag the **zip** onto the comment box. Wait for GitHub to attach it. Post.

If the zip is too big for GitHub (usually above ~25 MB), use Way 2.

**Way 2 — a shared folder link.**

1. Upload the folder to Google Drive, Dropbox, or iCloud.
2. Set the link to **anyone with the link can view**.
3. Paste that link on issue #11 with the same `manifest.csv` pasted as text.

Project Drive drop (optional, if you already have access):
https://drive.google.com/drive/folders/1snDbXGs7QKUMdul5sAnW6aWV_TePbfX2

**Way 3 — a pull request (only if you already use git).**

Put files in `protocol/experiment0/<your-github-name>/` and open a PR.
Do not commit 40 raw 12-megapixel originals if a 2000-pixel edge still shows the face.

---

## What “good” looks like

- The face fills most of the frame.
- A coin or ruler is visible.
- Pass 2 is the same face as pass 1, not the other side.
- Labels are on the end, not written across the photographed face.
- You say whether you could tell the lots apart **before** looking at the labels.

## What not to send

- Selfies, fireplace shots, or concrete blocks.
- A claim that JPEGs are a cryptographic fingerprint.
- Edited photos that change color a lot (filters off).

Fail is useful. If both lots look the same, say so.
