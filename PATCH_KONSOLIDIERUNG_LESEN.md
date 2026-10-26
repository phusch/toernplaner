# Patch-Konsolidierung – Törnplaner V1.5.8

**Wichtig:** Diese Bereinigung betrifft ausschließlich die historischen Patch-Dateien und die Projektdokumentation. Es wurden **keine funktionalen App-Dateien geändert**.

## Was wurde gemacht?

- Die **10** historischen `_PATCH.diff`-Dateien wurden aus diesem neuen Auslieferungs-ZIP entfernt.
- Stattdessen enthält das Paket genau **eine** `Toernplaner_V1.5.8_GESAMTPATCH.diff`.
- Diese neue Datei ist ein **echter, anwendbarer Netto-Gesamtpatch** von der im Chat hochgeladenen Basis `toernplaner.zip` auf den V1.5.8-Code, nicht eine fehleranfällige Aneinanderreihung unterschiedlicher historischer Patches.
- Die ursprünglichen Einzelpatches bleiben in der vorherigen, unveränderten Archiv-ZIP `Toernplaner_V1.5.8_Datenstand_SicherheitsTest.zip` erhalten. Sie sind also nicht verloren.
- Die Datei mit deinem privaten Törn-/Zahlungs-Backup ist **nicht** in diesem öffentlichen App-Paket enthalten.

## Voraussetzung für das Anwenden des Patch

Dieser Gesamtpatch ist ausschließlich für die **unveränderte Code-Ausgangsbasis aus `toernplaner.zip`** gedacht. Die gesammelten historischen Patches hatten unterschiedliche Vorversionen, deshalb repräsentiert diese Datei deren **effektive, im aktuellen Stand zusätzlich vorhandenen Änderungen gegenüber dieser bestimmten Codebasis** und nicht jeden alten Entwicklungsschritt.

Beispiel im Ordner der unveränderten Ausgangsbasis (nur falls man einen Patch technisch anwenden möchte):

```bash
git apply --check Toernplaner_V1.5.8_GESAMTPATCH.diff
git apply Toernplaner_V1.5.8_GESAMTPATCH.diff
```

Normalerweise ist kein Anwenden notwendig: **Der fertige aktuelle V1.5.8-Code liegt bereits im ZIP.** Der Patch dient nur der Dokumentation / späteren Reproduktion gegen die bezeichnete Basis.

## Originale historische Patch-Dateien (nicht mehr im neuen ZIP)

- `README_Toernplaner_V1.4.2_storage_status_PATCH.diff`
- `Toernplaner_V1.4.2_giftmann_logic_fix_PATCH.diff`
- `Toernplaner_V1.4.2_overview_gesamtbetrag_PATCH.diff`
- `Toernplaner_V1.4.2_storage_status_PATCH.diff`
- `Toernplaner_V1.4.4_dynamic_trip_title_PATCH.diff`
- `Toernplaner_V1.5.2_overview_installment_summary_PATCH.diff`
- `Toernplaner_V1.5.3_installments_per_traveler_PATCH.diff`
- `Toernplaner_V1.5.4_gift_total_PATCH.diff`
- `Toernplaner_V1.5.5_final_payment_PATCH.diff`
- `Toernplaner_V1.5.6_payment_status_sticky_PATCH.diff`

## Sicherheits- und Gleichheitsprüfung

- Alle aus der bisherigen V1.5.8 übernommenen Dateien außer den ursprünglichen Patch-Dateien sind **byteidentisch**.
- Vorhandene Berechnungs-, Zahlungs-, Giftmann-, Wise- und Speicherlogik wurden nicht bearbeitet.
- Der Gesamtpatch wurde mit `git apply --check` geprüft, auf die Ausgangsbasis angewandt und mit den aktuellen V1.5.8-Dateien byteweise abgeglichen.
- Der private Törn-Datenstand in deiner laufenden App wurde nicht geöffnet oder verändert.

**Hinweis:** Git verwaltet bereits die Versionsgeschichte. Die einzelnen historischen `*.diff`-Dateien sind zur Ausführung der fertigen App nicht erforderlich.
