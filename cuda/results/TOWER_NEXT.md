# Next GPU job (Tower 1060, dest 3070 parked)

Do **not** rerun firing smoke looking for net-m lock.

```
cd /boot/saelion/mumax   # or dest GrokShared/redcore-mumax
mumax3 -http= strain_sweep.mx3
```

Use the GitHub deck `cuda/mumax/strain_sweep.mx3`. Return the printed stress table + wall time + GPU model.

Pass/fail is software-only: Δm between 0 and 5 MPa after fill-scale. Physical Fabric still issue #6.
