import React, { Fragment, Component } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import RouterLink from '../ReactMetismenuRouterLink';

import MetisMenu from 'react-metismenu';

import {
  useMutation,
  useQuery,
  gql
} from "@apollo/client";


const GQL_PROJECT_LIST = gql`
  query Projects{
    projects {
      id
      batches {
        id
        queries {
          id
        }
      }
    }
  }
`;

/** 
class SidebarMenu extends Component {

  render() {
    const { loading, error, data } = useQuery(GQL_PROJECT_LIST);
    const sidebarMenuContent = [
      {
        label: 'Projects',
        icon: 'pe-7s-safe',
        content: data.projects.map((project) => ({
          label: project.id,
          description: '',
          to: '/projects/' + project.id
        }))
        
      }
    ];
    return (
      <Fragment>
        <PerfectScrollbar>
          <div className="sidebar-navigation">
            
            <div className="sidebar-header">
              <span>Navigation menu</span>
            </div>
            
            <MetisMenu
              content={sidebarMenuContent}
              LinkComponent={RouterLink}
              activeLinkFromLocation
              iconNamePrefix=""
              noBuiltInClassNames={true}
              classNameItemActive="active"
              classNameIcon="sidebar-icon"
              iconNameStateVisible="sidebar-icon-indicator"
              iconNameStateHidden="sidebar-icon-indicator"
              classNameItemHasVisibleChild="submenu-open"
              classNameItemHasActiveChild="active"
              classNameStateIcon="pe-7s-angle-down"
            />
          </div>
        </PerfectScrollbar>
      </Fragment>
    );
  }
}
*/
export default function SidebarMenu() {
  const { loading, error, data } = useQuery(GQL_PROJECT_LIST);
  
  console.log("SidebarMenu", loading, error, data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  const content = data.projects.map((project) => ({
    label: project.id,
    description: '',
    to: '/project/' + project.id
  }));
  const sidebarMenuContent = [
    {
      label: '项目列表',
      icon: 'pe-7s-safe',
      content: content,
    }
  ];
  return (
    <Fragment>
      <PerfectScrollbar>
        <div className="sidebar-navigation">
          <MetisMenu
            content={sidebarMenuContent}
            LinkComponent={RouterLink}
            activeLinkFromLocation
            iconNamePrefix=""
            noBuiltInClassNames={true}
            classNameItemActive="active"
            classNameIcon="sidebar-icon"
            iconNameStateVisible="sidebar-icon-indicator"
            iconNameStateHidden="sidebar-icon-indicator"
            classNameItemHasVisibleChild="submenu-open"
            classNameItemHasActiveChild="active"
            classNameStateIcon="pe-7s-angle-down"
          />
        </div>
      </PerfectScrollbar>
    </Fragment>
  );
}
