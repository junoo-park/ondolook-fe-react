import React from 'react';
import { useNavigate } from 'react-router-dom';

const notices = [
  {
    id: 1,
    title: '[안내] 서비스 소개',
    isNew: false,
    date: '2025. 05. 11. 13:30',
  },
  {
    id: 2,
    title: '[안내] 알림 설정 안내 공지문 (iOS / Android)',
    isNew: false,
    date: '2025. 05. 11. 10:15',
  },
];

const NoticeBoard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white h-full overflow-hidden">
      <div className="h-full overflow-y-auto px-5 pt-2 pb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        {notices.map(notice => (
          <div
            key={notice.id}
            className="py-4 border-b border-[#F0F0F0] cursor-pointer"
            onClick={() => navigate(`/my/notice/${notice.id}`)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#000] text-[16px] font-medium">{notice.title}</span>
              {notice.isNew && (
                <span className="bg-blue-500 text-white text-[12px] px-2 py-0.5 rounded-full">
                  new
                </span>
              )}
            </div>
            <div className="text-[#8E8E8E] text-[12px] font-normal">{notice.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
