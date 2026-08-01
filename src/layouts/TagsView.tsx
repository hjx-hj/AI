import { useState } from 'react';
import { Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '@/router/routes';

export const TagsView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tags, setTags] = useState<Array<{ path: string; title: string }>>([
    { path: '/', title: '首页' },
  ]);

  const currentPath = location.pathname;
  const currentRoute = routes.find((r) => r.path === currentPath) || routes.find((r) => r.children?.find((c) => c.path === currentPath));
  const currentTitle = currentRoute?.meta.title || '';

  if (!tags.find((t) => t.path === currentPath) && currentTitle) {
    setTags((prev) => [...prev, { path: currentPath, title: currentTitle }]);
  }

  const handleTagClick = (path: string) => {
    navigate(path);
  };

  const handleTagClose = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (path === '/') return;
    setTags((prev) => prev.filter((t) => t.path !== path));
    if (path === currentPath) {
      const remaining = tags.filter((t) => t.path !== path);
      navigate(remaining[remaining.length - 1]?.path || '/');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, padding: '8px 0' }}>
      {tags.map((tag) => (
        <Tag
          key={tag.path}
          closable={tag.path !== '/'}
          onClose={(e) => handleTagClose(tag.path, e)}
          onClick={() => handleTagClick(tag.path)}
          color={tag.path === currentPath ? 'blue' : undefined}
          style={{ cursor: 'pointer' }}
        >
          {tag.title}
        </Tag>
      ))}
    </div>
  );
};