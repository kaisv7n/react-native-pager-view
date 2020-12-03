import * as React from 'react';
import { Image, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import ViewPager, {
  PageScrollState,
  OverScrollMode,
  ViewPagerOnPageScrollEvent,
  ViewPagerOnPageSelectedEvent,
  PageScrollStateChangedNativeEvent,
} from 'react-native-viewpager';

import { PAGES, createPage } from './utils';
import { Button } from './component/Button';
import { LikeCount } from './component/LikeCount';
import { ProgressBar } from './component/ProgressBar';
import type { CreatePage } from './utils';

type State = {
  page: number;
  animationsAreEnabled: boolean;
  scrollEnabled: boolean;
  progress: {
    position: number;
    offset: number;
  };
  pages: Array<CreatePage>;
  scrollState: PageScrollState;
  dotsVisible: boolean;
  overScrollMode: OverScrollMode;
};

export default class ViewPagerExample extends React.Component<{}, State> {
  viewPager: React.RefObject<ViewPager>;

  constructor(props: any) {
    super(props);

    const pages = [];
    for (let i = 0; i < PAGES; i++) {
      pages.push(createPage(i));
    }

    this.state = {
      page: 0,
      animationsAreEnabled: true,
      scrollEnabled: true,
      progress: {
        position: 0,
        offset: 0,
      },
      pages: pages,
      scrollState: 'idle',
      dotsVisible: false,
      overScrollMode: 'auto',
    };
    this.viewPager = React.createRef();
  }

  onPageSelected = (e: ViewPagerOnPageSelectedEvent) => {
    this.setState({ page: e.nativeEvent.position });
  };

  onPageScroll = (e: ViewPagerOnPageScrollEvent) => {
    this.setState({
      progress: {
        position: e.nativeEvent.position,
        offset: e.nativeEvent.offset,
      },
    });
  };

  onPageScrollStateChanged = (e: PageScrollStateChangedNativeEvent) => {
    this.setState({ scrollState: e.nativeEvent.pageScrollState });
  };

  addPage = () => {
    this.setState((prevState) => ({
      pages: [...prevState.pages, createPage(prevState.pages.length)],
    }));
  };

  removeLastPage = () => {
    this.setState((prevState) => ({
      pages: prevState.pages.slice(0, prevState.pages.length - 1),
    }));
  };
  move = (delta: number) => {
    const page = this.state.page + delta;
    this.go(page);
  };

  go = (page: number) => {
    if (this.state.animationsAreEnabled) {
      /* $FlowFixMe we need to update flow to support React.Ref and createRef() */
      this.viewPager.current?.setPage(page);
    } else {
      /* $FlowFixMe we need to update flow to support React.Ref and createRef() */
      this.viewPager.current?.setPageWithoutAnimation(page);
    }
  };

  renderPage(page: CreatePage) {
    return (
      <View key={page.key} style={page.style} collapsable={false}>
        {/* $FlowFixMe */}
        <Image style={styles.image} source={page.imgSource} />
        <LikeCount />
      </View>
    );
  }

  toggleDotsVisibility = () => {
    this.setState((prevState) => ({ dotsVisible: !prevState.dotsVisible }));
  };

  render() {
    const { page, pages, animationsAreEnabled, dotsVisible } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ViewPager
          style={styles.viewPager}
          initialPage={0}
          scrollEnabled={this.state.scrollEnabled}
          onPageScroll={this.onPageScroll}
          onPageSelected={this.onPageSelected}
          onPageScrollStateChanged={this.onPageScrollStateChanged}
          pageMargin={10}
          // Lib does not support dynamically orientation change
          orientation="horizontal"
          // Lib does not support dynamically transitionStyle change
          transitionStyle="scroll"
          showPageIndicator={dotsVisible}
          overScrollMode={this.state.overScrollMode}
          ref={this.viewPager}
        >
          {pages.map((p) => this.renderPage(p))}
        </ViewPager>
        <View style={styles.buttons}>
          <Button
            enabled={true}
            text={
              this.state.scrollEnabled ? 'Scroll Enabled' : 'Scroll Disabled'
            }
            onPress={() =>
              this.setState({ scrollEnabled: !this.state.scrollEnabled })
            }
          />
          <Button
            enabled={true}
            text={dotsVisible ? 'Hide dots' : 'Show dots'}
            onPress={this.toggleDotsVisibility}
          />
          <Button enabled={true} text="Add new page" onPress={this.addPage} />
          <Button
            enabled={true}
            text="Remove last page"
            onPress={this.removeLastPage}
          />
        </View>
        <View style={styles.buttons}>
          {animationsAreEnabled ? (
            <Button
              text="Turn off animations"
              enabled={true}
              onPress={() => this.setState({ animationsAreEnabled: false })}
            />
          ) : (
            <Button
              text="Turn animations back on"
              enabled={true}
              onPress={() => this.setState({ animationsAreEnabled: true })}
            />
          )}
          <Text style={styles.scrollStateText}>
            ScrollState[ {this.state.scrollState} ]
          </Text>
        </View>
        <View style={styles.buttons}>
          <Button text="Start" enabled={page > 0} onPress={() => this.go(0)} />
          <Button
            text="Prev"
            enabled={page > 0}
            onPress={() => this.move(-1)}
          />
          <Button
            text="Next"
            enabled={page < pages.length - 1}
            onPress={() => this.move(1)}
          />
          <Button
            text="Last"
            enabled={page < pages.length - 1}
            onPress={() => this.go(pages.length - 1)}
          />
        </View>
        <View style={styles.progress}>
          <Text style={styles.buttonText}>
            {' '}
            Page {page + 1} / {pages.length}{' '}
          </Text>
          <ProgressBar
            numberOfPages={pages.length}
            size={300}
            progress={this.state.progress}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progress: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: 'black',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: 'white',
  },
  scrollStateText: {
    color: '#99d1b7',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 200,
    padding: 20,
  },
  viewPager: {
    flex: 1,
  },
});