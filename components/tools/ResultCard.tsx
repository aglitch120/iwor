'use client'

interface ResultCardProps {
  value: string | number
  label: string
  unit?: string
  interpretation?: string
  severity?: 'ok' | 'wn' | 'dn' | 'neutral'
  details?: { label: string; value: string }[]
}

const severityStyles = {
  ok: 'bg-okl border-okb text-ok',
  wn: 'bg-wnl border-wnb text-wn',
  dn: 'bg-dnl border-dnb text-dn',
  neutral: 'bg-s1 border-br text-tx',
}

export default function ResultCard({
  value,
  label,
  unit,
  interpretation,
  severity = 'neutral',
  details,
}: ResultCardProps) {
  return (
    <div className={`border rounded-xl p-5 ${severityStyles[severity]}`}>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold tabular-nums">
        {value}
        {unit && <span className="text-base font-normal ml-1">{unit}</span>}
      </p>
      {interpretation && (
        <p className="text-sm font-medium mt-2">{interpretation}</p>
      )}
      {details && details.length > 0 && (
        <div className="mt-3 pt-3 border-t border-current/10 space-y-1">
          {details.map((d, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{d.label}</span>
              <span className="font-medium">{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
