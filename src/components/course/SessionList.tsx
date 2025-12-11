import { Session } from '@/types';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface SessionListProps {
  sessions: Session[];
}

interface SessionItemProps {
  session: Session;
  index: number;
}

function SessionItem({ session, index }: SessionItemProps) {
  const { materials } = session;
  const hasExternalLinks = materials.slides || materials.code_repo || materials.recording;

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            第 {index + 1} 节: {session.title}
          </h3>
          
          {session.objectives.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">学习目标:</h4>
              <ul className="list-disc list-inside space-y-1">
                {session.objectives.map((objective, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {hasExternalLinks && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">课程材料:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {materials.slides && (
              <a
                href={materials.slides}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-medium">PPT</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">课件</p>
                </div>
                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
              </a>
            )}

            {materials.code_repo && (
              <a
                href={materials.code_repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 text-xs font-medium">CODE</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">代码仓库</p>
                </div>
                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
              </a>
            )}

            {materials.recording && (
              <a
                href={materials.recording}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <span className="text-purple-600 text-xs font-medium">REC</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">录像</p>
                </div>
                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
              </a>
            )}
          </div>
        </div>
      )}

      {materials.references.length > 0 && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">参考资料:</h4>
          <ul className="space-y-2">
            {materials.references.map((reference, idx) => (
              <li key={idx}>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>{reference.title}</span>
                  {reference.type && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {reference.type}
                    </span>
                  )}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无课程内容
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">课程内容</h2>
        <span className="text-sm text-gray-500">共 {sessions.length} 节课</span>
      </div>
      
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <SessionItem key={session.id} session={session} index={index} />
        ))}
      </div>
    </div>
  );
}