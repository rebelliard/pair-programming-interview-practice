# Hours ETags

## Candidate brief

- 50-minute feature-only API exercise
- Read and safely update opening hours
- No page, persistence service, or framework wrapper required

## What to observe

- Contract discovery before implementation
- Clear model for representations and validators
- Incremental verification through HTTP behavior
- Safe response to stale writes

## Debrief prompts

- Which bytes did the ETag protect?
- Why must a 304 have no body?
- How did canonical key ordering affect the validator?
- What changes would production persistence require?
