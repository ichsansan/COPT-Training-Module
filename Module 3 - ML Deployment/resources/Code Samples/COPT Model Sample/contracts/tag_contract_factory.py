from enum import IntEnum
from typing import Dict, Callable, Union, Any, Set
import numpy as np
import pandas as pd


class DatasetTagAssociationKind(IntEnum):
    # One core tag corresponds to one real tag. There is no possibility to combine multiple real tags into one core tag.
    Single = 0
    # Combining multiple real tags to one core tag.
    MultipleAverage = 1
    # Combining multiple real tags to one core tag.
    MultipleSum = 2
    # Using pandas data frame as input in order to calculate new tags.
    CustomFormulaPriorMapping = 3
    # Using the mapped pandas data frame as input in order to calculate new tags.
    CustomFormulaPostMapping = 4


class ModelTagAssociationKind(IntEnum):
    # One model for all labels
    SingleModel = 0
    # One model for each label
    MultipleModel = 1


class TagContractFactory:
    """
    The tag contract factory once set up is responsible for creating different instances of tag contracts.
    The settings of the tag contract factory should be shared among all tag contracts. These settings are
    mainly the names and the association types of each of the the core tags contained in the tag contract factory.
    This core tags are then associated within each tag contract with more concrete information about the tags.
    By creating the tag contract factory we should know all the core tags and their associations and then by creating a tag contract
    we should know all real resources and how to connect them with the defined core tags. The main functions of tag contract factory is to:
        * Create tag contracts;
        * To keep the design of the contract identical;
    """

    def __init__(
            self,
            alias: str,
            tag_to_association_kind: Dict[str, Union[str, int, float, bool]],
            tag_actions: Set[str],
            tag_groups: Set[str]):

        self._tag_to_association_kind = tag_to_association_kind
        self._alias = alias
        self._tag_actions = tag_actions
        self._tag_groups = tag_groups

    @property
    def tag_to_association_kind(self):
        return self._tag_to_association_kind

    @property
    def alias(self):
        return self._alias

    @property
    def tag_actions(self):
        return self._tag_actions

    @property
    def tag_groups(self):
        return self._tag_groups

    def initialize_contract(
        self,
        alias: str,
        tags_associations: Dict[
            str,
            Union[
                Dict[str, Callable[[Union[float, np.ndarray]],
                                   Union[float, np.ndarray]]],
                Callable[[pd.DataFrame, pd.DataFrame],
                         Union[float, np.ndarray, pd.DataFrame]]
            ]
        ],
        tags_to_actions: Dict[str, Dict[str, Callable[[Union[float, np.ndarray]], Any]]],
            tag_groups_map: Dict[str, Set[str]]) -> 'TagContract':

        for group in tag_groups_map:
            tag_group = tag_groups_map[group]
            for tag in tag_group:
                if tag not in self._tag_to_association_kind:
                    raise KeyError(
                        f"The tag '{tag}' in the tag groups map is not present in the tag to association kind dictionary.")

        for action in tags_to_actions:
            config_tags_actions = tags_to_actions[action]
            for tag in config_tags_actions:
                if tag not in self._tag_to_association_kind:
                    raise KeyError(
                        f"The tag '{tag}' in the configurations map is not present in the tag to association kind dictionary.")

        for tag in tags_associations:
            if tag not in self._tag_to_association_kind:
                raise KeyError(
                    f"In the tag to association kind map we are missing the tag '{tag}'.")

        for tag in self._tag_to_association_kind:
            if tag not in tags_associations:
                raise KeyError(
                    f"In the tag to real tags map we are missing the tag '{tag}'.")

        for action in tags_to_actions:
            if action not in self._tag_actions:
                raise KeyError(
                    f"In the tag actions we are missing the action '{action}'.")

        for action in self._tag_actions:
            if action not in tags_to_actions:
                raise KeyError(
                    f"In the tag to actions map we are missing the action '{action}'.")

        for group in tag_groups_map:
            if group not in self._tag_groups:
                raise KeyError(
                    f"In the tag groups we are missing the group '{group}'.")

        for group in self._tag_groups:
            if group not in tag_groups_map:
                raise KeyError(
                    f"In the tag groups map we are missing the group '{group}'.")

        return TagContract(
            alias=alias,
            tag_to_association_kind=self._tag_to_association_kind,
            tags_associations=tags_associations,
            tags_to_actions=tags_to_actions,
            tag_groups_map=tag_groups_map)


class TagContract:
    """
    The tag contract is a data object which is used as the only source of truth by declaring what should be a configurations of
    particular piece and how to execute them. The building block of this contract are tags, which are associated with actions and
    which can be also grouped. The tags and the associated actions to the tags can be consumed in custom implemented reducer functions which
    decide how to associate the tags with data an how the data should be consumed by the actions associated with the tags within the contract.
    """

    def __init__(
            self,
            alias: str,
            tag_to_association_kind: Dict[str, Union[str, int]],
            tags_associations: Dict[
                str, Union[
                    Dict[str, Callable[[Union[float, np.ndarray]],
                                       Union[float, np.ndarray]]],
                    Callable[[pd.DataFrame, pd.DataFrame], np.ndarray],
                    Callable[[pd.DataFrame], np.ndarray]
                ]],
            tags_to_actions: Dict[str, Dict[str, Callable[[Union[float, np.ndarray]], Any]]],
            tag_groups_map: Dict[str, Set[str]]):

        self._alias = alias
        self._tag_to_association_kind = tag_to_association_kind
        self._tags_associations = tags_associations
        self._tags_to_actions = tags_to_actions
        self._tag_groups_map = tag_groups_map

    @property
    def alias(self):
        return self._alias

    @property
    def tag_to_association_kind(self):
        return self._tag_to_association_kind

    @property
    def tags_associations(self):
        return self._tags_associations

    @property
    def tags_to_actions(self):
        return self._tags_to_actions

    @property
    def tag_groups_map(self):
        return self._tag_groups_map

    def get_active_tags(self):
        active_tags = list()
        for tag in self._tags_associations.keys():
            value = self._tags_associations[tag]
            if value is not None:
                active_tags.append(tag)

        return active_tags

    def is_whole_dict_in_group(
            self,
            group_tag: str,
            dictionary: Dict[str, Any]) -> bool:
        if group_tag not in self._tag_groups_map:
            raise ValueError(
                f"The provided group tag '{group_tag}' is not present in the contract.")
        is_match = True
        tags = self._tag_groups_map[group_tag]

        for tag in tags:
            value = self._tags_associations[tag]
            if value is not None:
                if tag not in dictionary:
                    is_match = False
                    break
        return is_match
