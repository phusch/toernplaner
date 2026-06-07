# Törnplaner / Chillout Pirates Kalkulation – V1.3 Trip Names

Diese Version basiert auf **V1.2 Save Guard** und ergänzt nur die bessere Verwaltung von Törnnamen.  
Ziel von V1.3 ist **komfortableres Benennen, Umbenennen und Kopieren von Törns**, nicht eine neue Berechnungslogik.

## Wichtigste Sicherheitsregel

In V1.3 wurden **keine Berechnungsformeln geändert**.

Nicht geändert wurden insbesondere:

- `calc()`
- Giftman/Giftmann-Berechnung
- Einzelbeträge-Logik
- Teilnehmerverwaltung-Berechnung
- Mannschaftskasse-Berechnung
- optische Sonderstellung der Mannschaftskasse

Die neue Version ergänzt nur Verwaltungs- und Speicherkomfort rund um Törnnamen und Cloud-Kopien.

---

## Was ist neu in V1.3?

### 1. Törnname direkt in der Törnkarte änderbar

In der Törn-Verwaltung gibt es jetzt in jeder Törnkarte ein eigenes Feld:

```text
Törnname
```

Dort kannst du den Namen direkt ändern, zum Beispiel:

```text
Friesland 2027
Seealpen Männer-Törn 2028
Chillout Pirates Teststand
```

Die Änderung wird lokal gespeichert und betrifft nur die Törn-Verwaltung.  
Die eigentliche Kostenberechnung wird dadurch nicht verändert.

Zusätzlich bleibt ein Button vorhanden:

```text
Name per Dialog
```

Damit kannst du den Törn weiterhin klassisch über ein kleines Eingabefenster umbenennen.

---

### 2. Cloud-Kopie bekommt beim Import einen eigenen Namen

Wenn du im Supabase-Bereich auf diesen Button klickst:

```text
Als Kopie importieren
```

fragt die App jetzt direkt nach einem neuen Namen für die lokale Kopie.

Beispiel:

```text
Cloud-Törn – Cloud-Kopie
```

Du kannst dann sofort einen besseren Namen vergeben, z. B.:

```text
Friesland 2027 – Cloud-Testkopie
```

Wenn du den Dialog abbrichst, wird **nichts importiert** und deine lokalen Daten bleiben unverändert.

---

### 3. Doppelte Törnnamen werden automatisch entschärft

Wenn ein Name lokal schon existiert, hängt die App automatisch eine Nummer an:

```text
Friesland 2027
Friesland 2027 (2)
Friesland 2027 (3)
```

Das verhindert Verwechslungen in der Törn-Verwaltung und beim Cloud-Test.

---

## Speicher-Procedere

### Normal an einem Törn arbeiten

```text
1. Törn öffnen
2. Änderungen machen
3. Anzeige oben prüfen: „Ungespeichert“
4. Speichern klicken
5. Anzeige oben prüfen: „Gespeichert“
6. Bei Bedarf: Aktiven Törn in Cloud speichern
```

### Törnnamen ändern

```text
1. Reiter „Törns“ öffnen
2. In der Törnkarte das Feld „Törnname“ ändern
3. Feld verlassen oder Enter drücken
4. Die App speichert den Namen lokal
5. Danach bei Bedarf erneut in Cloud speichern
```

Wichtig: Wenn du den Namen nur lokal änderst, ist der Cloud-Stand noch nicht automatisch umbenannt.  
Damit Supabase den neuen Namen bekommt, danach klicken:

```text
Aktiven Törn in Cloud speichern
```

oder:

```text
Alle lokalen Törns in Cloud speichern
```

### Alle Törns sauber sichern

```text
1. Einloggen in Supabase
2. Speichern klicken
3. Alle lokalen Törns in Cloud speichern
4. Backup exportieren
```

Das Backup bleibt weiterhin wichtig, weil es alle Törns in einer Datei sichert und unabhängig von Supabase funktioniert.

### Cloud-Stand ohne Risiko prüfen

```text
1. Einloggen
2. Cloud-Liste laden
3. Cloud-Törn auswählen
4. Als Kopie importieren
5. Neuen Namen vergeben
6. Kopie prüfen
7. Erst danach entscheiden, ob ein alter lokaler Stand gelöscht werden soll
```

---

## Die fünf Prioritäten aus V1.2 bleiben erhalten

### Priorität 1: Ungespeichert-Warnung

Die App erkennt weiterhin, ob seit dem letzten Speichern Änderungen gemacht wurden.

Oben beim aktiven Törn steht:

```text
Gespeichert
```

oder:

```text
Ungespeichert
```

Bei riskanten Aktionen warnt die App, zum Beispiel beim Törnwechsel, Backup-Import oder Cloud-Laden.

### Priorität 2: Alle Törns in Cloud speichern

Der Button bleibt erhalten:

```text
Alle lokalen Törns in Cloud speichern
```

Damit werden alle lokalen Törns nacheinander nach Supabase übertragen.

### Priorität 3: Speicherstatus je Törn

Jede Törnkarte zeigt weiterhin:

```text
Lokal gespeichert: Datum/Uhrzeit
Cloud: gespeichert Datum/Uhrzeit · Rev. X
```

oder:

```text
Cloud: noch nicht gespeichert
```

### Priorität 4: Sicherer Cloud-Import

Cloud-Laden bleibt bewusst sicher:

```text
Ausgewählten Cloud-Törn übernehmen
```

überschreibt nur nach Rückfrage.

```text
Als Kopie importieren
```

legt eine neue lokale Kopie an und fragt jetzt nach einem neuen Namen.

### Priorität 5: Automatisches lokales Speichern bleibt vorerst deaktiviert

Automatisches Speichern ist weiterhin bewusst nicht aktiviert.

Der sichere Arbeitsfluss bleibt:

```text
Änderung machen
→ Ergebnis prüfen
→ bewusst Speichern klicken
→ optional Cloud speichern
```

---

## Supabase-Zugangsdaten

In der App brauchst du weiterhin:

```text
Project URL
Publishable / anon Key
E-Mail
Passwort
```

Wichtig:

```text
Niemals service_role oder secret key in die App eintragen.
```

Die Project URL und der öffentliche Key stehen in Supabase unter:

```text
Project Settings
→ API / API Keys
```

---

## Was wird in Supabase gespeichert?

V1.3 speichert den Törnzustand weiterhin als JSON.

Das ist Absicht:

- Die lokale App bleibt die Rechenbasis.
- Supabase speichert nur den Zustand.
- Die bestehende Berechnung wird nicht auseinandergezogen.
- Giftman/Giftmann bleibt durch die unveränderte lokale Logik geschützt.

---

## Pflichtprüfung nach dem ersten Öffnen

Nach dem ersten Öffnen von V1.3 bitte prüfen:

```text
Giftman 1. Überweisung: 0,00 €
Giftman Charter fällig: 0,00 €
Giftman Mannschaftskasse fällig: 0,00 €
Einzelbeträge und Teilnehmerverwaltung konsistent
Mannschaftskasse weiterhin wie bisher
```

---

## Versionsstand

```text
V1.0 stabil
V1.1 Cloud-Test
V1.2 Save Guard
V1.3 Trip Names
```
