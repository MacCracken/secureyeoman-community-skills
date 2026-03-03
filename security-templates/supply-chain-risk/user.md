# Supply Chain Risk Assessment

## Project Information
- **Project name**: {{project_name}}
- **Language/ecosystem**: {{ecosystem}}
<!-- e.g., Node.js/npm, Python/pip, Java/Maven, Go modules, Rust/Cargo -->
- **Repository URL**: {{repo_url}}

## Dependency Data
{{dependency_data}}
<!-- Paste: package.json, requirements.txt, go.sum, Cargo.lock, pom.xml,
     or output from `npm audit`, `pip audit`, `trivy`, `grype`, etc. -->

## Build Pipeline
- **CI/CD platform**: {{cicd_platform}}
<!-- e.g., GitHub Actions, GitLab CI, Jenkins, CircleCI -->
- **Pipeline configuration**: {{pipeline_config}}
<!-- Paste CI config file or describe the build/deploy process -->

## Vendor Dependencies
{{vendor_list}}
<!-- List critical third-party services and SaaS vendors:
     - Vendor name, service type, data classification, contract status -->

## Current Security Controls
- **Dependency scanning**: {{dep_scanning}}
- **SBOM generation**: {{sbom_status}}
- **Artifact signing**: {{signing_status}}

## Assessment Focus
{{focus_areas}}
<!-- e.g., full assessment, dependency audit only, vendor review, SLSA evaluation -->
