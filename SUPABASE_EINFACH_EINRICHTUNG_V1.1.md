# Törnplaner V1.1 Cloud-Test – einfache Supabase-Einrichtung

Diese Version basiert auf `Toernplaner_V1.0_stabil.zip`.

Wichtig: Die lokale App bleibt die Grundlage. Supabase wird in dieser Version nur manuell benutzt:

- **Cloud speichern** speichert den aktiven Törn bewusst in Supabase.
- **Cloud-Liste laden** lädt nur die Liste deiner Cloud-Törns.
- **Ausgewählten Cloud-Törn übernehmen** fragt vor dem Überschreiben lokaler Daten nach.
- Es gibt keinen automatischen Sync und keine automatische Überschreibung.

## 1. Project URL finden

In Supabase:

1. Projekt öffnen.
2. Links unten/seitlich auf **Project Settings** klicken.
3. Bereich **API** oder **API Keys** öffnen.
4. Kopieren:
   - **Project URL**
   - **Publishable key** oder bei älteren Projekten **anon public key**

Niemals verwenden:

- `service_role`
- `secret key`

Diese Keys gehören nicht in eine Browser-App.

## 2. Datenbank vorbereiten

In Supabase:

1. Links auf **SQL Editor**.
2. **New query**.
3. Inhalt aus `supabase_migration_001_initial_sync_schema.sql` einfügen.
4. **Run** klicken.

Danach im **Table Editor** prüfen, ob diese Tabellen sichtbar sind:

- `profiles`
- `trips`
- `trip_states`

## 3. E-Mail-Login für Test vereinfachen

In Supabase:

1. **Authentication** öffnen.
2. **Providers** öffnen.
3. **Email** öffnen.
4. Für den ersten Test die E-Mail-Bestätigung deaktivieren, falls du nicht auf eine Bestätigungsmail warten möchtest.

## 4. App testen

1. `index.html` öffnen.
2. Reiter **Törns** öffnen.
3. Im Bereich **Supabase Cloud-Test** eintragen:
   - Project URL
   - Publishable / anon Key
   - E-Mail
   - Passwort
4. **Verbindung speichern** klicken.
5. **Registrieren** klicken.
6. Falls Registrierung nicht sofort einloggt: **Einloggen** klicken.
7. Aktiven Törn prüfen.
8. **Aktiven Törn in Cloud speichern** klicken.
9. Danach **Cloud-Liste laden** klicken.
10. Einen Törn auswählen und nur bei Bedarf **Ausgewählten Cloud-Törn übernehmen** klicken.

## 5. Pflichtprüfung Giftman/Giftmann

Nach dem Cloud-Test prüfen:

- Giftman Einzelbeträge: 0,00 €
- Giftman Teilnehmerverwaltung Charter: 0,00 €
- Giftman Teilnehmerverwaltung Mannschaftskasse: 0,00 €
- Einzelbeträge und Teilnehmerverwaltung konsistent
- Mannschaftskasse bleibt hellblau und kursiv
- Namen werden nicht doppelt angezeigt

## 6. Was wurde geändert?

Geändert wurden nur:

- `index.html`
  - Supabase-Bibliothek per CDN eingebunden
  - manueller Cloud-Testbereich im Reiter Törns ergänzt
  - neue Funktionen für Registrierung, Login, Logout, Cloud speichern, Cloud-Liste laden und Cloud-Törn übernehmen
  - keine Änderung an `calc()`
  - keine Änderung an Giftman/Giftmann-Logik

- `sw.js`
  - Cache-Name geändert, damit Browser/PWA die neue Version neu lädt

Nicht geändert:

- bestehende Berechnung
- Kostenlogik
- Teilnehmerverwaltung-Logik
- Einzelbeträge-Logik
- Mannschaftskasse-Optik
