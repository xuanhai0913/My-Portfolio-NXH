# CV Icon Assets

Reusable icon set for the generated visual CV.

## Sources

- Contact icons: Bootstrap Icons official library, MIT license.
  https://icons.getbootstrap.com/
- OpenAI/Codex usage reference: OpenAI brand guidelines.
  https://openai.com/brand/
- Antigravity usage reference: Google Antigravity press assets.
  https://antigravity.google/press
- Claude/Codex/Antigravity SVG set: LobeHub model icon library for reusable AI tool icons.
  https://lobehub.com/icons

## Structure

- `contact/*.svg`: source contact SVG icons.
- `contact/png/*.png`: cropped PNG versions used by ReportLab.
- `ai/*.svg`: source AI tool SVG icons.
- `ai/png/*.png`: cropped PNG versions used by ReportLab.
- `section/*.svg`: white section heading icons from Bootstrap Icons.
- `workflow/*.svg`: teal AI Workflow step icons from Bootstrap Icons.
- `stack/*.svg`: stack/source-control SVG icons copied for portfolio reuse.

The PDF generator uses PNG files because ReportLab embeds them more reliably than complex SVGs.
