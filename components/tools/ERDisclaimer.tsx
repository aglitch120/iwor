/**
 * ER対応ツリー共通の免責コンポーネント
 * 緊急性の高い医療情報を扱うため、通常のツールより強い免責を表示
 */

/** ページ冒頭に表示する免責バナー */
export function ERDisclaimerBanner() {
  return (
    <div className="bg-dnl border-2 border-dnb rounded-xl p-4 mb-6">
      <p className="text-sm font-bold text-dn mb-2">⚠️ 本ツールは臨床判断の「補助」であり、診療プロトコルの代替ではありません</p>
      <ul className="text-sm text-dn/90 space-y-1">
        <li>• 本フローは医療従事者の思考整理を目的としており、個別の患者への治療指示ではありません</li>
        <li>• 記載の薬剤名・用量・閾値は一般的な教科書的記載であり、処方箋ではありません。必ず添付文書・施設プロトコルを確認してください</li>
        <li>• 実際の診療では必ず施設のプロトコル・上級医の指示に従ってください</li>
        <li>• 患者の状態は刻々と変化します — フローに当てはまらない状況は常にあり得ます</li>
        <li>• 本ツールの使用によるいかなる結果についても、開発者は責任を負いません</li>
      </ul>
    </div>
  )
}

/** ページ下部に表示する詳細免責 */
export function ERDisclaimerFooter() {
  return (
    <div className="bg-dnl border-2 border-dnb rounded-xl p-5 mb-8">
      <p className="text-sm font-bold text-dn mb-3">⚠️ 医療情報に関する重要な免責事項</p>
      <div className="text-sm text-dn/90 space-y-2">
        <p>
          本ツールは医療従事者が救急診療において系統的な思考を行うための「補助ツール」です。
          診断・治療の最終判断は、必ず担当医が患者の個別の状態を評価した上で行ってください。
        </p>
        <p>
          記載されている対応フローは一般的な教科書的アプローチに基づいていますが、
          個々の患者・施設の状況により最適な対応は異なります。
          必ず自施設のプロトコル・ガイドラインを優先してください。
        </p>
        <p>
          本ツールの情報は定期的に見直していますが、医学知識は日々更新されます。
          最新のガイドラインと異なる可能性があることをご了承ください。
        </p>
        <p className="font-semibold">
          本ツールの使用により生じたいかなる損害・不利益についても、開発者・運営者は一切の責任を負いません。
        </p>
      </div>
    </div>
  )
}

/** 各結果ノードの末尾に付与する注意書き */
export function ERResultCaution() {
  return (
    <div className="bg-s1 border border-br rounded-lg p-3 mt-3">
      <p className="text-xs text-muted">
        💡 上記は一般的なアプローチの一例です。実際の対応は患者の状態・施設の体制・上級医の判断を優先してください。
        迷う場合は必ず上級医・専門科にコンサルトしてください。
      </p>
    </div>
  )
}
