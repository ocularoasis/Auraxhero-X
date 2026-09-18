# DeleteMeFast Supabase Connection Boundary

DeleteMeFast uses one dedicated Supabase project:

- Project: `deletemefast`
- Project ref: `cmakyvrqgjsfgphfkkhr`
- Region: `us-east-1`
- URL: `https://cmakyvrqgjsfgphfkkhr.supabase.co`

## Isolation rule

DeleteMeFast must never connect to another Supabase project. In particular, the historical project ref `hkpsxodfogghhlnzvzgp` is not a DeleteMeFast target.

The application Supabase client enforces this boundary at runtime. `NEXT_PUBLIC_SUPABASE_URL` may be supplied by the deployment environment, but it is rejected unless it resolves to the dedicated DeleteMeFast host.

The publishable key must remain an environment secret/configuration value and must not be committed to Git.

## v0 / deployment configuration

The external v0/Vercel connector must independently select the Supabase project whose ref is `cmakyvrqgjsfgphfkkhr`. If a connector presents a different project ref, do not approve database operations.

Required public environment value:

```
NEXT_PUBLIC_SUPABASE_URL=https://cmakyvrqgjsfgphfkkhr.supabase.co
```

Required publishable key:

```
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<DeleteMeFast project's publishable key>
```

Never copy credentials from Brindlewick, MarketRail, or the historical mixed project.
