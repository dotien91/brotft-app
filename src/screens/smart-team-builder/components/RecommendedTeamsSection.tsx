import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import TeamCard from '@screens/home/components/team-card/TeamCard';
import { translations } from '../../../shared/localization';

export interface RecommendedTeamsSectionProps {
  matchedTeams: any[];
  isSearching: boolean;
  isFetching: boolean;
  hasSelection: boolean;
}

const RecommendedTeamsSection: React.FC<RecommendedTeamsSectionProps> = ({
  matchedTeams,
  isSearching,
  isFetching,
  hasSelection,
}) => {
  const { colors } = useTheme();
  const teams = Array.isArray(matchedTeams) ? matchedTeams : [];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{translations.recommendedTeams}</Text>
        {(isSearching || isFetching) && <ActivityIndicator size="small" color={colors.primary} />}
      </View>
      <View style={styles.teamsListContainer}>
        {teams.length === 0 ? (
          <Text style={styles.emptyText}>
            {hasSelection ? translations.noTeamsFound : translations.selectUnitsOrItemsAbove}
          </Text>
        ) : (
          teams.map((comp: any, idx: number) => (
            <TeamCard key={comp.id || idx} composition={comp} />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { paddingBottom: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginBottom: 6, gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  teamsListContainer: { paddingHorizontal: 6, gap: 6 },
  emptyText: { textAlign: 'center', marginTop: 12, color: '#9ca3af' },
});

export default RecommendedTeamsSection;
